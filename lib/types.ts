// 팀 공통 타입. 바꿀 때는 단톡에 먼저 알려 주세요.

export type Product = {
  id: string; // 네이버 productId
  title: string; // <b> 태그 제거된 상품명
  link: string; // 상품 페이지 URL
  image: string; // 썸네일 URL (mock 데이터는 빈 문자열)
  price: number; // 최저가 (원)
  brand: string; // 브랜드 → 없으면 제조사 → 없으면 쇼핑몰명
  mallName: string;
  category: string;
};

export type SearchResponse = {
  items: Product[];
  source: "naver" | "mock";
};

export type Order = {
  id: string; // 예: TJ-20261114-0042
  createdAt: string; // ISO 문자열
  items: Product[];
  total: number; // 구조된 금액 (= 장바구니 총액)
  address: string;
};
