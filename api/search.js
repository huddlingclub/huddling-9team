// 네이버쇼핑 검색 프록시. 토큰은 서버에만 둔다. 토큰이 없으면 목 데이터로 답한다.
const fs = require('fs');
const path = require('path');

const ACTOR = 'g0DIy7jhI0dLfdKoo'; // topapi/naver-shopping-scraper
const CACHE = new Map(); // 같은 검색어 재호출 비용 방지 (인스턴스 메모리)
const TTL = 10 * 60 * 1000;

function normalize(r) {
  const price = r.discountedSalePrice ?? r.salePrice ?? 0;
  return {
    id: String(r.nvMid ?? r.channelProductId ?? r.productPageUrl ?? r.productName),
    name: r.productName || '이름 없는 상품',
    image: r.imageUrl || '',
    price: Math.round(price),
    listPrice: Math.round(r.salePrice ?? price),
    discount: Math.round(r.discountedRatio ?? 0),
    mall: r.mallName || '',
    rating: r.averageReviewScore ?? null,
    reviews: r.totalReviewCount ?? 0,
    url: r.productPageUrl || '',
  };
}

function mock(q) {
  const file = path.join(process.cwd(), 'data', 'sample.json');
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  const k = q.trim().toLowerCase();
  const hit = items.filter((p) => p.name.toLowerCase().includes(k));
  return (hit.length ? hit : items).map((p) => ({ ...p, name: p.name }));
}

async function search(q, sort) {
  const token = process.env.APIFY_TOKEN;
  if (!token) return { source: 'mock', items: mock(q) };

  const key = `${q}|${sort}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.at < TTL) return { source: 'apify', items: cached.items };

  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?timeout=55`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ keywords: [q], maxProductsPerKeyword: 20, sort }),
  });
  if (!res.ok) throw new Error(`apify ${res.status}`);
  const rows = await res.json();
  const items = rows.filter((r) => r.type !== 'review' && (r.discountedSalePrice || r.salePrice)).map(normalize);
  CACHE.set(key, { at: Date.now(), items });
  return { source: 'apify', items };
}

module.exports = async function handler(req, res) {
  const u = new URL(req.url, 'http://x');
  const q = (u.searchParams.get('q') || '').trim().slice(0, 60);
  const sort = ['REL', 'PURCHASE', 'REVIEW', 'LOW_PRICE', 'HIGH_PRICE'].includes(u.searchParams.get('sort'))
    ? u.searchParams.get('sort') : 'REL';
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!q) { res.statusCode = 400; return res.end(JSON.stringify({ error: '검색어를 입력해줘' })); }
  try {
    res.end(JSON.stringify(await search(q, sort)));
  } catch (e) {
    // 외부 실패 시에도 데모가 멈추지 않게 목으로 대체
    res.end(JSON.stringify({ source: 'mock', note: String(e.message), items: mock(q) }));
  }
};
