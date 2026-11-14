import type { Product } from "./types";

// 네이버 API 키가 없을 때 /api/search 가 대신 돌려주는 가짜 상품.
// 키 없이도 화면 작업을 할 수 있게 하려는 용도예요.
const MOCK_PRODUCTS: Product[] = [
  { id: "m1", title: "Apple 맥북 프로 14 M4", link: "https://example.com", image: "", price: 2390000, brand: "Apple", mallName: "목업몰", category: "디지털/가전" },
  { id: "m2", title: "다이슨 에어랩 멀티 스타일러", link: "https://example.com", image: "", price: 699000, brand: "다이슨", mallName: "목업몰", category: "디지털/가전" },
  { id: "m3", title: "에르메스 버킨 25", link: "https://example.com", image: "", price: 25000000, brand: "에르메스", mallName: "목업몰", category: "패션잡화" },
  { id: "m4", title: "소니 WH-1000XM6 무선 헤드폰", link: "https://example.com", image: "", price: 549000, brand: "소니", mallName: "목업몰", category: "디지털/가전" },
  { id: "m5", title: "LG 스탠바이미 2", link: "https://example.com", image: "", price: 1290000, brand: "LG전자", mallName: "목업몰", category: "디지털/가전" },
  { id: "m6", title: "롤렉스 서브마리너 데이트", link: "https://example.com", image: "", price: 14500000, brand: "롤렉스", mallName: "목업몰", category: "패션잡화" },
  { id: "m7", title: "닌텐도 스위치 2", link: "https://example.com", image: "", price: 648000, brand: "닌텐도", mallName: "목업몰", category: "디지털/가전" },
  { id: "m8", title: "허먼밀러 에어론 체어", link: "https://example.com", image: "", price: 2150000, brand: "허먼밀러", mallName: "목업몰", category: "가구/인테리어" },
];

export function mockSearch(query: string): Product[] {
  const q = query.toLowerCase();
  const hits = MOCK_PRODUCTS.filter(
    (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
  );
  return hits.length > 0 ? hits : MOCK_PRODUCTS;
}
