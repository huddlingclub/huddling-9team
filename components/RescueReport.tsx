import { dateTime, won } from "@/lib/format";
import type { Order } from "@/lib/types";

// 구조 보고서 (= 영수증). 완료 화면과 랜딩 미리보기에서 같이 써요.
// 담당: 구조 보고서
export default function RescueReport({ order, deliveryStatus }: { order: Order; deliveryStatus: string }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-mono text-sm shadow-sm">
      <p className="text-center text-base font-bold">🚑 텅장구조대 구조 보고서</p>
      <dl className="mt-4 space-y-1">
        <div className="flex justify-between">
          <dt className="text-gray-500">구조 번호</dt>
          <dd>{order.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">구조 일시</dt>
          <dd>{dateTime(order.createdAt)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-gray-500">구매(한 척) 품목</p>
      <ul className="mt-1 space-y-1">
        {order.items.map((p) => (
          <li key={p.id} className="flex justify-between gap-2">
            <span className="truncate">{p.title}</span>
            <span className="shrink-0">{won(p.price)}</span>
          </li>
        ))}
      </ul>

      <div className="my-4 border-t border-dashed border-gray-300" />
      <div className="flex justify-between">
        <span>결제한 금액</span>
        <span>₩0</span>
      </div>
      <div className="mt-1 flex justify-between text-base font-bold text-emerald-600">
        <span>구조된 금액</span>
        <span>{won(order.total)} ✅</span>
      </div>
      <div className="my-4 border-t border-dashed border-gray-300" />
      <p>배송 상태: {deliveryStatus}</p>
    </div>
  );
}
