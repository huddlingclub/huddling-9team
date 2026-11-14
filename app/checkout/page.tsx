"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { won } from "@/lib/format";
import { createOrder, saveOrder } from "@/lib/order";

// 5. 결제 — 담당: 장바구니·결제
// 실제 결제처럼 보이는 카드번호/개인정보 입력란은 만들지 않아요.

export default function CheckoutPage() {
  const { items, total, clear, ready } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ready && items.length === 0 && !paying) router.replace("/cart");
  }, [ready, items.length, paying, router]);

  async function pay() {
    setPaying(true);
    setMessage("구조대 출동 중… 🚑");
    await new Promise((r) => setTimeout(r, 1200));
    setMessage("통장 확보 완료 ✅");
    await new Promise((r) => setTimeout(r, 800));
    saveOrder(createOrder(items, address.trim()));
    clear();
    router.push("/done");
  }

  if (!ready || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">주문/결제</h1>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-bold">주문 상품 {items.length}개</h2>
        <p className="mt-1 text-sm text-gray-500 truncate">{items.map((p) => p.title).join(", ")}</p>
      </section>

      <section className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <label className="font-bold" htmlFor="address">
          배송지 (아무 데나 적어도 돼요)
        </label>
        <input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="예: 화성 올림푸스 산 정상"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </section>

      <section className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-bold">결제수단</h2>
        <p className="mt-2 rounded-lg border-2 border-emerald-500 bg-emerald-50 p-3 text-sm">
          🚑 구조페이 · 잔액 무제한 · 수수료 0원
        </p>
      </section>

      <button
        onClick={pay}
        disabled={paying}
        className="mt-6 w-full rounded-xl bg-emerald-500 py-4 text-lg font-bold text-white disabled:opacity-70"
      >
        {paying ? message : `구조페이로 ${won(total)} 결제하기`}
      </button>
    </div>
  );
}
