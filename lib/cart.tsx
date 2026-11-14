"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "./types";

// 장바구니 상태 (localStorage 에 저장). 어느 페이지에서든 useCart() 로 써요.
// 같은 상품은 한 번만 담겨요 (수량 개념 없음).

const STORAGE_KEY = "tj-cart";

type CartContextValue = {
  items: Product[];
  total: number;
  ready: boolean; // localStorage 를 읽기 전에는 false
  add: (p: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // 저장소를 못 읽으면 빈 장바구니로 시작
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 저장 실패는 무시
    }
  }, [items, ready]);

  const add = useCallback(
    (p: Product) => setItems((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p])),
    [],
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);
  const total = useMemo(() => items.reduce((sum, p) => sum + p.price, 0), [items]);

  return (
    <CartContext.Provider value={{ items, total, ready, add, remove, has, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 는 CartProvider 안에서만 쓸 수 있어요");
  return ctx;
}
