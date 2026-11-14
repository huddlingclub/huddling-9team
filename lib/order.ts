import type { Order, Product } from "./types";

// 결제(구조) 완료된 주문을 저장/불러오기. 결제 화면 → 구조 보고서 화면 전달용.

const STORAGE_KEY = "tj-last-order";

export function createOrder(items: Product[], address: string): Order {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return {
    id: `TJ-${ymd}-${serial}`,
    createdAt: now.toISOString(),
    items,
    total: items.reduce((sum, p) => sum + p.price, 0),
    address,
  };
}

export function saveOrder(order: Order) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // 저장 실패는 무시
  }
}

export function loadOrder(): Order | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Order) : null;
  } catch {
    return null;
  }
}
