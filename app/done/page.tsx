"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RescueReport from "@/components/RescueReport";
import { loadOrder } from "@/lib/order";
import type { Order } from "@/lib/types";

// 6. 결제 완료 = 구조 보고서 — 담당: 구조 보고서

const DELIVERY_STEPS = [
  "구조 물품 포장 중…",
  "평행세계 물류센터 도착",
  "멀티유니버스의 나에게 배송 중…",
  "다른 차원의 나에게 전달 시도 중",
  "배송 지연: 다음 생",
];

export default function DonePage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setOrder(loadOrder());
    setLoaded(true);
    const timer = setInterval(() => setStep((s) => (s + 1) % DELIVERY_STEPS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  if (!loaded) return null;

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">아직 구조된 기록이 없어요.</p>
        <Link href="/shop" className="mt-4 inline-block text-emerald-600 underline">
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="mb-6 text-center text-2xl font-bold">구조 완료! 통장이 무사해요 🎉</h1>
      <RescueReport order={order} deliveryStatus={DELIVERY_STEPS[step]} />
      <div className="mt-6 text-center">
        <Link href="/shop" className="inline-block rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white">
          다시 쇼핑하기
        </Link>
      </div>
    </div>
  );
}
