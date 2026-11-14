# 🚑 텅장구조대

> 사고 싶은 거, 다 사세요. 통장은 저희가 지킵니다.

진짜 상품(네이버 쇼핑)을 검색해 장바구니에 담고 결제까지 해 보는 대리만족 쇼핑 서비스.
돈은 안 나가고, 마지막에 **구조 보고서(영수증)** 로 "구조된 금액"을 보여준다.

📄 화면별 기능·API·문구·QA 체크리스트는 [기능 명세서](docs/SPEC.md) 참고.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 네이버 키를 채우면 진짜 상품, 비워 두면 가짜 상품
npm run dev                  # http://localhost:3000
```

- 네이버 키 발급: [developers.naver.com](https://developers.naver.com) → 애플리케이션 등록 → 사용 API **검색**
- `.env.local` 은 커밋되지 않는다. 키는 단톡에 올리지 말고 각자 넣거나 API 담당에게 받기.
- 키가 없어도 `/api/search` 가 mock 상품을 돌려주니 화면 작업은 바로 시작할 수 있다.

## 화면 흐름

| # | 경로 | 화면 | 파일 |
|---|---|---|---|
| 1 | `/` | 랜딩 (컨셉 + 구조 보고서 미리보기) | `app/page.tsx` |
| 2·3 | `/shop` | 추천 키워드 리스트 + 검색 + 담기 | `app/shop/page.tsx` |
| 4 | `/cart` | 장바구니 | `app/cart/page.tsx` |
| 5 | `/checkout` | 결제 (구조페이) | `app/checkout/page.tsx` |
| 6 | `/done` | 구조 보고서 + 배송 연출 | `app/done/page.tsx`, `components/RescueReport.tsx` |

지금은 전체 흐름이 **동작하는 최소 버전**이 들어가 있다. 각 담당은 자기 파일을 다듬으면 된다.

## 역할 분담 (7명)

| 역할 | 인원 | 브랜치 | 맡는 파일 | 할 일 |
|---|---|---|---|---|
| **API·배포** | 1 | `feat/api` | `app/api/search/route.ts`, `lib/mock-products.ts` | 네이버 키 발급, Vercel 배포 + 환경 변수 설정, 추천 키워드 정하기, 에러 처리 |
| **리스트·검색 A** | 1 | `feat/shop-search` | `app/shop/page.tsx` | 검색창, 키워드 탭, 로딩/에러 상태, 더보기 |
| **리스트·검색 B** | 1 | `feat/shop-card` | `components/ProductCard.tsx` (새로 만들기), `components/Toast.tsx` | 상품 카드 UI, 담기 피드백(토스트 "통장이 위험해요 🚨") |
| **장바구니·결제** | 1 | `feat/cart-checkout` | `app/cart/page.tsx`, `app/checkout/page.tsx` | 장바구니 UI, 결제 화면, "구조대 출동 중…" 로딩 연출 |
| **구조 보고서** | 1 | `feat/report` | `app/done/page.tsx`, `components/RescueReport.tsx` | 모바일 영수증 느낌 디자인, 배송 상태 연출, (여유 시) 캡처/공유 |
| **랜딩·디자인** | 1 | `feat/landing` | `app/page.tsx`, `components/Header.tsx`, `app/globals.css` | 랜딩 카피·레이아웃, 공통 색/톤 정리 |
| **PM·발표·QA** | 1 | — | — | 시간 관리, PR 리뷰·머지 순서 관리, 전체 흐름 테스트, 발표 자료 |

리스트·검색 B가 `ProductCard` 를 만들면, A가 `app/shop/page.tsx` 의 카드 부분을 `<ProductCard product={p} />` 로 바꿔 끼운다. 그 전까지는 A가 지금 카드 마크업을 그대로 둔다.

## 브랜치 작업 방법

역할별 브랜치는 GitHub에 미리 만들어 두었다. 각자 자기 브랜치만 받아서 작업한다.

```bash
git clone https://github.com/huddlingclub/huddling-9team.git
cd huddling-9team
git switch feat/shop-search      # ← 자기 브랜치 이름
npm install
cp .env.example .env.local
npm run dev
```

작업 중에는 자주 커밋·푸시한다.

```bash
git add .
git commit -m "검색창 디자인"
git push
```

끝나면 GitHub에서 **자기 브랜치 → `main`** 으로 PR을 만든다. PM이 순서대로 머지한다.

다른 사람 작업이 `main` 에 먼저 들어갔으면, 자기 브랜치에 받아서 맞춘다.

```bash
git pull origin main
```

- 자기 담당 파일만 고친다. 공용 파일(아래)을 꼭 바꿔야 하면 단톡에 먼저 말한다.
- `main` 에 직접 푸시하지 않는다.
- `.env.local` 은 절대 커밋하지 않는다. 커밋 전에 `git status` 로 확인.

### 공용 파일 (바꾸기 전에 단톡에 공유)

- `lib/types.ts` — `Product`, `Order` 타입
- `lib/cart.tsx` — `useCart()` (items, total, add, remove, has, clear)
- `lib/order.ts` — 결제 → 완료 화면으로 주문 전달
- `app/layout.tsx`

## 규칙

- 네이버 로고·"네이버 쇼핑" 이름은 쓰지 않는다. 레이아웃·색감만 패러디.
- 결제 화면에 카드번호·실제 개인정보 입력란을 만들지 않는다.
- API 키는 `.env.local` 에만. `NEXT_PUBLIC_` 접두사 금지.
- 각자 역할 브랜치에서 작업 → `main` 으로 PR. 자기 담당 파일 위주로 수정해 충돌을 줄인다.

## 시간표 (2시간)

| 시간 | 목표 |
|---|---|
| 0:00–0:15 | 클론·설치·실행, 네이버 키 발급 |
| 0:15–1:20 | 각자 담당 화면 작업 |
| 1:20–1:40 | main 에 합치고 전체 흐름 테스트 |
| 1:40–2:00 | 배포, 버그 수정, 발표 준비 |
