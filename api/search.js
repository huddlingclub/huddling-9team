// 네이버쇼핑 검색 프록시. 토큰은 서버에만 둔다. 토큰이 없으면 목 데이터로 답한다.
// Apify 호출은 유료(검색 1회 약 $0.018)라서 아래 순서로 막는다.
//   1) 서버 캐시(검색어 정규화, LRU, 기본 60분)  2) 같은 검색어 동시 요청 합치기
//   3) 실패한 검색어는 30초간 재호출 안 함       4) IP별 · 하루 호출 한도
//   5) Vercel CDN 캐시 헤더(s-maxage)            ※ 서버리스는 인스턴스마다 메모리가 따로라 1)~4)는 최선 노력이다
const fs = require('fs');
const path = require('path');

const ACTOR = 'g0DIy7jhI0dLfdKoo'; // topapi/naver-shopping-scraper
const TTL = (Number(process.env.SEARCH_CACHE_MIN) || 60) * 60 * 1000;
const LIMIT = Math.min(40, Math.max(1, Number(process.env.SEARCH_LIMIT) || 20)); // 검색 1회당 상품 수
const IP_MAX = Number(process.env.SEARCH_IP_MAX) || 8; // IP당 10분에 새로 부르는 횟수
const IP_WINDOW = 10 * 60 * 1000;
const DAY_MAX = Number(process.env.APIFY_DAILY_LIMIT) || 300; // 하루 전체 호출 상한
const FAIL_TTL = 30 * 1000;
const CACHE_MAX = 300;

const cache = new Map(); // key -> { at, items }  (삽입 순서로 LRU)
const inflight = new Map(); // key -> Promise
const failed = new Map(); // key -> 재시도 가능 시각
const ipHits = new Map(); // ip -> [시각]
const day = { d: '', n: 0 };

const norm = (q) => q.trim().replace(/\s+/g, ' ').toLowerCase();

function cacheGet(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > TTL) { cache.delete(key); return null; }
  cache.delete(key); cache.set(key, e); // 최근 사용으로 갱신
  return e.items;
}
function cacheSet(key, items) {
  cache.set(key, { at: Date.now(), items });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
}

function checkLimits(ip) {
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  if (day.d !== today) { day.d = today; day.n = 0; }
  if (day.n >= DAY_MAX) return '오늘 검색 한도를 모두 썼어요. 내일 다시 시도해 주세요.';
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < IP_WINDOW);
  if (hits.length >= IP_MAX) return '검색을 너무 자주 하셨어요. 잠시 뒤에 다시 시도해 주세요.';
  hits.push(now); ipHits.set(ip, hits); day.n++;
  if (ipHits.size > 1000) for (const [k, v] of ipHits) if (!v.some((t) => now - t < IP_WINDOW)) ipHits.delete(k);
  return null;
}

// 네이버 상품 이미지는 원본이 수백 KB라 w300 썸네일로 받는다(화면 최대 폭은 약 170px, 2배 화면 대응)
function thumb(u) {
  try {
    const x = new URL(u);
    if (x.hostname.endsWith('.pstatic.net') && !x.search) x.search = '?type=w300';
    return x.toString();
  } catch { return u || ''; }
}

function normalize(r) {
  const price = r.discountedSalePrice ?? r.salePrice ?? 0;
  return {
    id: String(r.nvMid ?? r.channelProductId ?? r.productPageUrl ?? r.productName),
    name: r.productName || '이름 없는 상품',
    image: thumb(r.imageUrl),
    price: Math.round(price),
    listPrice: Math.round(r.salePrice ?? price),
    discount: Math.round(r.discountedRatio ?? 0),
    mall: r.mallName || '',
    rating: r.averageReviewScore ?? null,
    reviews: r.totalReviewCount ?? 0,
    url: r.productPageUrl || '',
  };
}

function mock(key) {
  const items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'sample.json'), 'utf8'));
  const hit = items.filter((p) => p.name.toLowerCase().includes(key));
  return hit.length ? hit : items;
}

async function fetchApify(q, token) {
  const res = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?timeout=55`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    // 정렬은 항상 기본(REL). 가격·리뷰 정렬은 화면에서 이 결과를 다시 늘어놓는다.
    body: JSON.stringify({ keywords: [q], maxProductsPerKeyword: LIMIT, sort: 'REL' }),
    signal: AbortSignal.timeout(58000),
  });
  if (!res.ok) throw new Error(`apify ${res.status}`);
  const rows = await res.json();
  return rows.filter((r) => r.type !== 'review' && (r.discountedSalePrice || r.salePrice)).map(normalize);
}

// 반환: { source, items, cache, note? } 또는 { limited: '메시지' }
async function search(q, ip) {
  const key = norm(q);
  const token = process.env.APIFY_TOKEN;
  if (!token) return { source: 'mock', items: mock(key), cache: 'MOCK' };

  const hit = cacheGet(key);
  if (hit) return { source: 'apify', items: hit, cache: 'HIT' };

  if ((failed.get(key) || 0) > Date.now()) return { source: 'mock', items: mock(key), cache: 'FAIL', note: 'upstream-failed' };

  if (inflight.has(key)) return { ...(await inflight.get(key)), cache: 'DEDUPED' };

  const limited = checkLimits(ip);
  if (limited) return { limited };

  const p = fetchApify(q.trim(), token)
    .then((items) => { cacheSet(key, items); return { source: 'apify', items }; })
    .catch((e) => { failed.set(key, Date.now() + FAIL_TTL); return { source: 'mock', items: mock(key), note: e.message }; })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return { ...(await p), cache: 'MISS' };
}

module.exports = async function handler(req, res) {
  const u = new URL(req.url, 'http://x');
  const q = (u.searchParams.get('q') || '').trim().slice(0, 60);
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (!q) { res.statusCode = 400; return res.end(JSON.stringify({ error: '검색어를 입력해 주세요.' })); }
  try {
    const r = await search(q, ip);
    if (r.limited) { res.statusCode = 429; return res.end(JSON.stringify({ error: r.limited })); }
    res.setHeader('X-Cache', r.cache);
    // 실제 Apify 결과만 CDN이 오래 들고 있게 한다(샘플·실패는 저장 안 함)
    if (r.source === 'apify') res.setHeader('Cache-Control', `public, s-maxage=${TTL / 1000}, stale-while-revalidate=86400`);
    res.end(JSON.stringify({ source: r.source, items: r.items, ...(r.note ? { note: r.note } : {}) }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: '검색에 실패했어요. 잠시 뒤에 다시 시도해 주세요.' }));
  }
};
