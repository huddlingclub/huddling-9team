"use client";

import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/lib/cart";
import { won } from "@/lib/format";
import type { Product, SearchResponse } from "@/lib/types";

// 2·3. 물건 리스트 + 검색 — 담당: 리스트·검색

const KEYWORDS = ["맥북", "다이슨", "명품백", "롤렉스", "닌텐도", "안마의자"];

export default function ShopPage() {
  const [query, setQuery] = useState(KEYWORDS[0]);
  const [input, setInput] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [source, setSource] = useState<SearchResponse["source"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { add, has } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "검색 실패");
        return res.json() as Promise<SearchResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setSource(data.source);
      })
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) setQuery(input.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="사고 싶은 걸 검색하세요"
          className="flex-1 rounded-xl border-2 border-emerald-500 bg-white px-4 py-3 outline-none"
        />
        <button className="rounded-xl bg-emerald-500 px-5 font-bold text-white">검색</button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {KEYWORDS.map((k) => (
          <button
            key={k}
            onClick={() => setQuery(k)}
            className={`rounded-full border px-3 py-1 text-sm ${
              query === k ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-300 bg-white"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {source === "mock" && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          네이버 API 키가 없어서 가짜 상품을 보여주고 있어요. (.env.local 설정 필요)
        </p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-gray-500">찾는 중…</p>}

      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
            <ProductImage src={p.image} alt={p.title} className="aspect-square w-full" />
            <div className="flex flex-1 flex-col p-3">
              <p className="text-xs text-gray-500">{p.brand}</p>
              <p className="mt-1 line-clamp-2 text-sm">{p.title}</p>
              <p className="mt-2 font-bold">{won(p.price)}</p>
              <button
                onClick={() => add(p)}
                disabled={has(p.id)}
                className="mt-3 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white disabled:bg-gray-300"
              >
                {has(p.id) ? "담김" : "담기"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
