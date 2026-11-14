// 로컬 개발 서버: node server.js  → http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

try { // .env.local 로드 (값은 출력하지 않는다)
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (m && m[2]) process.env[m[1]] = m[2];
  }
} catch {}

const search = require('./api/search.js');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  if (p === '/api/search') return search(req, res);
  const clean = p === '/' ? '/index.html' : p.replace(/\.\./g, '');
  const file = path.join(__dirname, clean.endsWith('/') ? clean + 'index.html' : clean);
  fs.readFile(file, (err, buf) => {
    if (err) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('Content-Type', (TYPES[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    res.end(buf);
  });
}).listen(3000, () => console.log('http://localhost:3000', process.env.APIFY_TOKEN ? '(Apify 실연동)' : '(목 데이터 모드)'));
