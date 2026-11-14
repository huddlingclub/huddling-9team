// 추천 칩 검색어를 Apify로 한 번만 받아 data/presets.json에 저장한다. (유료: 검색어 1개당 약 $0.018)
// 쓰는 법: node tools/prefetch.js            -> 저장본이 없는 검색어만 받는다
//          node tools/prefetch.js --force    -> 전부 다시 받는다(가격·재고를 새로 맞출 때)
// 토큰은 .env.local의 APIFY_TOKEN. 값은 출력하지 않는다.
const fs = require('fs');
const path = require('path');
try {
  for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && m[2]) process.env[m[1]] = m[2];
  }
} catch {}
process.env.SEARCH_LIMIT = process.env.SEARCH_LIMIT || '20'; // 미리 받는 것은 한 번뿐이라 넉넉히
const { norm, fetchApify } = require('../api/search.js');

const KEYWORDS = ['에어팟', '맥북', '닌텐도 스위치', '레고', '캠핑의자', '다이슨 에어랩', '여성 향수', '원피스', '샤넬 가방', '스탠리 텀블러']; // search.html 칩과 같게 둔다
const FILE = path.join(__dirname, '..', 'data', 'presets.json');
const force = process.argv.includes('--force');
const token = process.env.APIFY_TOKEN;
if (!token) { console.error('APIFY_TOKEN이 없습니다 (.env.local)'); process.exit(1); }

(async () => {
  let saved = {};
  try { saved = JSON.parse(fs.readFileSync(FILE, 'utf8')).items || {}; } catch {}
  const items = { ...saved };
  let calls = 0;
  for (const q of KEYWORDS) {
    const k = norm(q);
    if (items[k] && !force) { console.log('건너뜀(저장본 있음):', q); continue; }
    try {
      const rows = await fetchApify(q, token); calls++;
      if (!rows.length) { console.log('결과 없음, 저장 안 함:', q); continue; }
      items[k] = rows;
      console.log('저장:', q, rows.length + '개');
    } catch (e) { console.log('실패:', q, e.message); }
  }
  fs.writeFileSync(FILE, JSON.stringify({ fetchedAt: new Date().toISOString(), items }));
  console.log(`끝. Apify 호출 ${calls}회(약 $${(calls * 0.018).toFixed(2)}), 저장 ${Object.keys(items).length}개 -> data/presets.json`);
})();
