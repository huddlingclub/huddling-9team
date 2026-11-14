// 공용: 장바구니(localStorage) · 포맷 · 상단바 · 토스트
const KEY = 'tj_cart', ORDERS = 'tj_orders';
const won = (n) => Number(n || 0).toLocaleString('ko-KR') + '원';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// 장바구니 항목의 off:true 는 '선택 해제'. 금액, 주문에는 선택한(off가 아닌) 상품만 들어간다.
const cart = {
  get: () => load(KEY, []),
  picked: () => cart.get().filter((x) => !x.off),
  count: () => cart.get().reduce((a, b) => a + b.qty, 0),
  pickedCount: () => cart.picked().reduce((a, b) => a + b.qty, 0),
  total: () => cart.picked().reduce((a, b) => a + b.price * b.qty, 0),
  listTotal: () => cart.picked().reduce((a, b) => a + (b.listPrice || b.price) * b.qty, 0),
  add(p) {
    const c = cart.get(), f = c.find((x) => x.id === p.id);
    f ? (f.qty++, delete f.off) : c.push({ id: p.id, name: p.name, image: p.image, price: p.price, listPrice: p.listPrice, discount: p.discount, mall: p.mall, qty: 1 });
    save(KEY, c); header();
  },
  set(id, qty) { save(KEY, cart.get().map((x) => (x.id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0)); header(); },
  pick(id, on) { save(KEY, cart.get().map((x) => (id === null || x.id === id ? { ...x, off: !on } : x))); header(); },
  removePicked() { save(KEY, cart.get().filter((x) => x.off)); header(); },
  // 결제 뒤에는 주문한(선택한) 상품만 비우고, 선택 해제한 상품은 남긴다
  clear() { cart.removePicked(); },
};

const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
};

function header() {
  const el = document.getElementById('top');
  if (el) {
    const n = cart.count(), title = el.dataset.title;
    // data-title 이 있는 화면(장바구니 등)은 로고 자리에 '뒤로 + 화면 이름'을 둔다
    el.innerHTML = title
      ? `<div class="wrap"><div class="titlebar"><a class="iconbtn back" href="${el.dataset.back || '/'}" aria-label="뒤로">${ICON.back}</a><h1 class="logo">${esc(title)}</h1></div></div>`
      : `<div class="wrap"><a class="logo" href="/" aria-label="텅장구조대 홈"><img src="/assets/logo-wordmark.png" width="330" height="72" alt="텅장구조대"></a>
    <a class="iconbtn cartlink" href="/cart.html" aria-label="장바구니 ${n}개">${ICON.bag}<span id="badge" data-n="${n}">${n}</span></a></div>`;
    const bk = el.querySelector('.back');
    if (bk) bk.onclick = (e) => { if (history.length > 1 && document.referrer.startsWith(location.origin)) { e.preventDefault(); history.back(); } };
    const b = document.getElementById('badge');
    if (b && window._lastCount !== undefined && window._lastCount !== cart.count()) { b.classList.add('bump'); setTimeout(() => b.classList.remove('bump'), 300); }
  }
  window._lastCount = cart.count();
  if (window.onCart) window.onCart();
}
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.append(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1400);
}
document.addEventListener('DOMContentLoaded', header);
// 이모지를 쓰지 않으므로 파비콘도 글자로 만든다
(() => { const l = document.createElement('link'); l.rel = 'icon'; l.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='16' fill='black'/><text x='50' y='72' font-size='64' font-weight='800' text-anchor='middle' fill='white'>텅</text></svg>"; document.head.append(l); })();
