// 상품 사진을 같은 도메인으로 중계한다.
// 영수증의 하프톤(점) 변환은 브라우저가 사진 픽셀을 읽어야 하는데, 네이버 이미지 서버는 CORS를 허용하지 않아
// 그대로는 읽을 수 없다. 아무 주소나 중계하지 않도록 네이버 이미지 도메인(*.pstatic.net)의 https 이미지로만 제한한다.
const MAX = 2 * 1024 * 1024; // 2MB

module.exports = async function handler(req, res) {
  const fail = (code, msg) => { res.statusCode = code; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(msg); };
  let target;
  try { target = new URL(new URL(req.url, 'http://x').searchParams.get('u') || ''); } catch { return fail(400, 'bad url'); }
  const host = target.hostname;
  const ok = target.protocol === 'https:' && (host === 'pstatic.net' || host.endsWith('.pstatic.net')) && !target.port && !target.username && !target.password;
  if (!ok) return fail(400, 'not allowed');
  try {
    // 다른 호스트로의 리다이렉트를 따라가지 않는다(허용 목록 우회 방지)
    const r = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Mozilla/5.0' } });
    const type = r.headers.get('content-type') || '';
    if (r.status !== 200 || !type.startsWith('image/')) return fail(502, 'upstream');
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAX) return fail(413, 'too large');
    res.setHeader('Content-Type', type);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
    res.end(buf);
  } catch { fail(504, 'timeout'); }
};
