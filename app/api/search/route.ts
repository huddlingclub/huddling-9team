import { NextResponse } from "next/server";
import { mockSearch } from "@/lib/mock-products";
import type { Product, SearchResponse } from "@/lib/types";

// GET /api/search?query=맥북&display=20
// 네이버 쇼핑 검색 API 프록시. 브라우저에서 네이버를 바로 부르면 CORS에 막히고
// 키가 노출되므로 반드시 이 라우트를 거쳐서 불러 주세요.
// NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 이 없으면 mock 데이터를 돌려줘요.

const NAVER_SHOP_URL = "https://openapi.naver.com/v1/search/shop.json";

type NaverItem = {
  title: string;
  link: string;
  image: string;
  lprice: string;
  brand: string;
  maker: string;
  mallName: string;
  productId: string;
  category1: string;
  category2: string;
};

function cleanText(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toProduct(item: NaverItem): Product {
  return {
    id: item.productId,
    title: cleanText(item.title),
    link: item.link,
    image: item.image,
    price: Number(item.lprice) || 0,
    brand: item.brand || item.maker || item.mallName,
    mallName: item.mallName,
    category: [item.category1, item.category2].filter(Boolean).join("/"),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ error: "query 파라미터가 필요해요" }, { status: 400 });
  }
  const display = Math.min(Math.max(Number(searchParams.get("display")) || 20, 1), 100);

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const body: SearchResponse = { items: mockSearch(query), source: "mock" };
    return NextResponse.json(body);
  }

  const url = `${NAVER_SHOP_URL}?${new URLSearchParams({ query, display: String(display), sort: "sim" })}`;
  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    next: { revalidate: 3600 }, // 같은 검색어는 1시간 캐시 (일일 호출 한도 절약)
  });

  if (!res.ok) {
    console.error("[api/search] naver error", res.status, await res.text());
    return NextResponse.json({ error: "네이버 쇼핑 API 호출에 실패했어요" }, { status: 502 });
  }

  const data = (await res.json()) as { items: NaverItem[] };
  const body: SearchResponse = { items: data.items.map(toProduct), source: "naver" };
  return NextResponse.json(body);
}
