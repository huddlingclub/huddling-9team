// 공용: 장바구니(localStorage) · 포맷 · 헤더
const KEY = 'tj_cart', ORDERS = 'tj_orders';
const won = (n) => Number(n || 0).toLocaleString('ko-KR') + '원';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const cart = {
  get: () => load(KEY, []),
  count: () => cart.get().reduce((a, b) => a + b.qty, 0),
  total: () => cart.get().reduce((a, b) => a + b.price * b.qty, 0),
  add(p) {
    const c = cart.get(), f = c.find((x) => x.id === p.id);
    f ? f.qty++ : c.push({ id: p.id, name: p.name, image: p.image, price: p.price, mall: p.mall, qty: 1 });
    save(KEY, c); header();
  },
  set(id, qty) { save(KEY, cart.get().map((x) => (x.id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0)); header(); },
  clear() { save(KEY, []); header(); },
};

function header() {
  const el = document.getElementById('top');
  if (!el) return;
  el.innerHTML = `<div class="wrap"><a class="logo" href="/">텅장구조대</a>
  <a class="cartlink" href="/cart.html">장바구니<i id="badge">${cart.count()}</i></a></div>`;
  window._lastCount=cart.count();
  if(window.onCart) window.onCart();
}
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.append(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1400);
}
document.addEventListener('DOMContentLoaded', header);
(() => { const l = document.createElement('link'); l.rel = 'icon'; l.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='black'/><text x='50' y='72' font-size='64' font-weight='700' fill='white' text-anchor='middle'>텅</text></svg>"; document.head.append(l); })();
