import Link from "next/link";
import RescueReport from "@/components/RescueReport";
import type { Order } from "@/lib/types";

// 1. 랜딩 — 담당: 랜딩·디자인

const SAMPLE_ORDER: Order = {
  id: "TJ-20261114-0042",
  createdAt: "2026-11-14T06:32:00.000Z",
  address: "",
  total: 3089000,
  items: [
    { id: "s1", title: "다이슨 에어랩", link: "", image: "", price: 699000, brand: "", mallName: "", category: "" },
    { id: "s2", title: "맥북 프로 14", link: "", image: "", price: 2390000, brand: "", mallName: "", category: "" },
  ],
};

export default function Landing() {
  return (
    <div className="grid items-center gap-10 py-6 md:grid-cols-2">
      <section>
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          사고 싶은 거, 다 사세요.
          <br />
          통장은 저희가 지킵니다.
        </h1>
        <p className="mt-4 text-gray-600">
          진짜 상품을 담고 결제까지 해 보세요. 돈은 안 나가고, 배송도 안 와요.
        </p>
        <p className="mt-2 text-sm text-gray-400">※ 실제 결제·배송이 일어나지 않는 체험 서비스예요.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600"
        >
          구조 요청하기
        </Link>
      </section>
      <section>
        <p className="mb-3 text-center text-sm text-gray-500">쇼핑이 끝나면 이런 보고서를 받아요</p>
        <RescueReport order={SAMPLE_ORDER} deliveryStatus="멀티유니버스의 나에게 배송 중…" />
      </section>
    </div>
  );
}
