"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

// 담당: 랜딩·디자인
export default function Header() {
  const { items, ready } = useCart();
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-emerald-600">
          🚑 텅장구조대
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/shop">쇼핑</Link>
          <Link href="/cart">장바구니{ready && items.length > 0 ? ` (${items.length})` : ""}</Link>
        </nav>
      </div>
    </header>
  );
}
