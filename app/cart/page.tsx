"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/lib/cart";
import { won } from "@/lib/format";

// 4. 장바구니 — 담당: 장바구니·결제

export default function CartPage() {
  const { items, total, remove, ready } = useCart();

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">장바구니가 비어 있어요. 통장이 아직 안전해요.</p>
        <Link href="/shop" className="mt-4 inline-block text-emerald-600 underline">
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">장바구니</h1>
      <p className="mt-1 text-red-500">🚨 현재 통장 위험도 {won(total)}</p>

      <ul className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-4 p-4">
            <ProductImage src={p.image} alt={p.title} className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{p.title}</p>
              <p className="font-bold">{won(p.price)}</p>
            </div>
            <button onClick={() => remove(p.id)} className="text-sm text-gray-400 hover:text-gray-700">
              삭제
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg">총 {won(total)}</span>
        <Link href="/checkout" className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white">
          결제하기
        </Link>
      </div>
    </div>
  );
}
