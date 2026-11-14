---
name: 텅장구조대
base: 29CM DESIGN.md (토큰과 컴포넌트 규격만 가져옴, 로고와 이름은 쓰지 않음)
viewport: 375px (모바일 기준, 높이 812px)
preview: https://tungjang-rescue.vercel.app
colors:
  ink: '#000000'
  canvas: '#ffffff'
  muted: '#5d5d5d'
  ink-2: '#303033'
  ink-3: '#474747'
  accent: '#ff4800'
  border: '#dddddd'
  focus: '#375fff'
  pressed: '#f4f4f4'
  disabled: 'rgba(93,93,93,0.4)'
  chip: 'rgba(93,93,93,0.08)'
  paper: '#f6f3ec'
  dark: '#222222'
typography:
  family: Pretendard Variable
  unit: px
  display:  { size: 48, weight: 800, lineHeight: 1.0 }
  title-lg: { size: 23, weight: 600, lineHeight: 1.3 }
  title-md: { size: 20, weight: 700, lineHeight: 1.3 }
  title-sm: { size: 18, weight: 700, lineHeight: 1.3 }
  body-lg:  { size: 16, weight: 400, lineHeight: 1.5 }
  body:     { size: 14, weight: 400, lineHeight: 1.5 }
  label:    { size: 13, weight: 400, lineHeight: 1.4 }
  caption:  { size: 12, weight: 400, lineHeight: 1.5 }
  brand:    { size: 11, weight: 700, lineHeight: 1.36 }
  micro:    { size: 10, weight: 500, lineHeight: 1.2 }
spacing: [2, 4, 8, 16, 24, 28]
rounded: { sm: 2px, md: 4px, chip: 10px, full: 9999px }
shadow: none
---

# 텅장구조대 DESIGN.md

목업 코드(Next.js + Tailwind v4)에 그대로 입히기 위한 디자인 기준이다. AI(Claude, Codex)에게 작업을 시킬 때는 "루트의 DESIGN.md를 따라 이 화면에 스타일을 입혀줘"라고 요청한다.

- 미리보기: https://tungjang-rescue.vercel.app (PC에서는 아이폰 틀, 휴대폰에서는 전체 화면)
- 기준 폭: 375px. 가로 스크롤이 생기면 안 된다.
- 스타일 바탕: 29CM 디자인 토큰. 쇼핑몰 로고와 서비스명은 쓰지 않는다.
- 시작(랜딩)과 끝(구조 보고서)만 다르게 하고, 쇼핑 화면은 익숙한 쇼핑몰 흐름을 따른다.

## 0. 꼭 지킬 것

1. 이모지, 아이콘, 일러스트를 임의로 넣지 않는다. 글자 버튼, 구분선, 회색 이미지 자리로 만든다.
2. 그림자 박스, 한쪽 변 강조선, 그라데이션 배경을 쓰지 않는다.
3. 1순위 버튼(검정 채움)은 한 화면에 하나만 둔다.
4. 한 줄에 나란히 놓인 버튼은 위계가 달라도 높이와 글자 크기를 같게 한다. 차이는 채움과 너비 비율(보조 1 : 주요 2)로만 둔다.
5. 누르는 곳은 높이 40px 이상, 주요 버튼은 44px 이상이다.
6. 할인율 `#ff4800`은 글자색으로만 쓴다. 채움 배경으로 쓰지 않는다.
7. 아래 토큰 밖의 색과 글자 크기는 쓰지 않는다.

## 1. 바로 붙여 쓰는 코드

### 1-1. `app/globals.css`

```css
@import "tailwindcss";

@theme {
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;

  --color-ink: #000000;
  --color-canvas: #ffffff;
  --color-muted: #5d5d5d;
  --color-ink-2: #303033;
  --color-ink-3: #474747;
  --color-accent: #ff4800;
  --color-line: #dddddd;
  --color-focus: #375fff;
  --color-pressed: #f4f4f4;
  --color-chip: rgba(93, 93, 93, 0.08);
  --color-paper: #f6f3ec;
  --color-dark: #222222;

  --text-display: 48px;  --text-display--line-height: 1;
  --text-title-lg: 23px; --text-title-lg--line-height: 1.3;
  --text-title-md: 20px; --text-title-md--line-height: 1.3;
  --text-title-sm: 18px; --text-title-sm--line-height: 1.3;
  --text-body-lg: 16px;  --text-body-lg--line-height: 1.5;
  --text-body: 14px;     --text-body--line-height: 1.5;
  --text-label: 13px;    --text-label--line-height: 1.4;
  --text-caption: 12px;  --text-caption--line-height: 1.5;
  --text-brand: 11px;    --text-brand--line-height: 1.36;
  --text-micro: 10px;    --text-micro--line-height: 1.2;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-chip: 10px;
}

body {
  background: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
}

button, input { font-family: inherit; }
:focus-visible { outline: 1px solid var(--color-focus); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition: none !important; }
}
```

### 1-2. `app/layout.tsx`의 `<head>`에 Pretendard 불러오기

```tsx
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
/>
```

`<main>`의 폭은 모바일 기준으로 `mx-auto max-w-[375px] px-4`를 권한다.

### 1-3. 컴포넌트 className

| 컴포넌트 | className | 규격 |
| --- | --- | --- |
| 1순위 버튼 | `h-[52px] w-full rounded-md bg-ink text-body-lg font-bold text-canvas disabled:bg-[rgba(93,93,93,0.4)]` | 높이 52px, 16px/700 |
| 보조 버튼 | `h-11 rounded-md border border-line bg-canvas px-4 text-body font-bold active:bg-pressed active:text-ink-3` | 높이 44px, 14px/700 |
| 카드 안 담기 버튼 | `h-10 w-full rounded-md border border-line bg-canvas text-label font-bold` | 높이 40px, 13px/700 |
| 칩 | `h-9 rounded-chip bg-chip px-2.5 text-label text-ink-3` / 선택: `bg-ink text-canvas` | 높이 36px, 13px |
| 검색창 | `flex h-11 items-center rounded-md border-[1.5px] border-ink px-3 text-body-lg` | 높이 44px, 16px |
| 상단바 | `flex h-[52px] items-center justify-between border-b border-line px-4` + 제목 `text-title-sm font-bold` | 높이 52px |
| 상품 그리드 | `grid grid-cols-2 gap-x-2 gap-y-5` | 2열, 8px / 20px |
| 상품 이미지 | `aspect-square rounded-md bg-[#f2f2f2] object-cover` | 1:1, 4px |
| 상품 브랜드 | `mt-2 text-brand font-bold` | 11px/700 |
| 상품명 | `mt-0.5 line-clamp-2 text-caption leading-[1.36]` | 12px/400, 두 줄 |
| 가격 | `mt-1 text-label font-bold` + 할인율 `mr-1 text-accent` | 13px/700 |
| 배송 문구 | `mt-0.5 text-micro font-medium text-muted` | 10px/500 |
| 수량 스테퍼 | 버튼 `size-10 border border-line`, 입력 `h-10 w-11 border-y border-line text-center` | 40px |
| 토스트 | `fixed inset-x-4 bottom-24 rounded-md bg-[#111] px-4 py-3.5 text-body text-canvas` | 1.4초 뒤 사라짐 |
| 정보 박스 | `rounded-md border border-line p-4` + 제목 `mb-2.5 text-body font-bold` | 결제 화면 |

## 2. 화면별 기준 (docs/SPEC.md 경로 기준)

### `/` 랜딩

- 바탕 흰색(`canvas`). 베이지를 쓰지 않는다.
- 글자 로고 `텅장구조대` (`text-display font-extrabold tracking-[-2px]`), 아래 영문 보조 `RESCUE YOUR ACCOUNT 2026` (`text-caption font-semibold text-muted`)
- 소개 문구 `text-title-lg font-semibold`
- 안내 세 줄은 위아래 구분선 목록(`border-t border-line py-3 text-body text-ink-2`)
- 하단 1순위 버튼 하나

### `/shop` 상품 리스트, 검색

- 상단바 왼쪽 `텅장구조대`, 오른쪽 글자 버튼 `장바구니 N`
- 검색창 → 카테고리 칩 → 섹션 제목(`text-body-lg font-bold`) → 상품 2열 그리드
- 결과 0개: `찾는 물건이 없어요. 다른 이름으로 검색해 보세요.` (`text-body text-muted`, 가운데)
- 담기 뒤 토스트: `장바구니에 담았어요. 아직 돈은 안 나갔어요.`

### `/cart` 장바구니

- 상품 줄: 썸네일 80px, 브랜드, 상품명, 금액, 수량 스테퍼, 글자 버튼 `삭제`, 줄 사이 `border-b border-line`
- 하단 고정: 총 주문 예상 금액(`text-title-md font-bold`) + 1순위 버튼 `주문하기 (N)`
- 비었을 때: 안내 문구 + 보조 버튼 `쇼핑하러 가기`, 1순위 버튼은 비활성

### `/checkout` 결제

- 정보 박스 순서: 배송지 → 주문 상품 → 결제 수단 → 금액 요약
- 결제 수단은 같은 높이(44px) 버튼 세 개를 나란히, 선택은 `border-ink font-bold`
- 안내 `결제하기를 눌러도 실제로 돈이 나가지 않아요.` (`text-caption text-muted`)
- 하단 1순위 버튼 `결제하기`

### `/done` 구조 보고서

- 바탕 `dark`(#222), 가운데 영수증 폭 280px, 바탕 `paper`(#f6f3ec), 글자 `text-caption`, 숫자는 `tabular-nums`
- 구분은 점선(`border-t border-dashed border-ink`), 맨 아래 톱니 모양
- 들어올 때 영수증이 위에서 아래로 1.6초 동안 출력된다(동작 줄이기 설정이면 바로 보임)
- 아래 버튼 두 개는 높이 52px, 글자 16px/700로 같게: 보조 `처음으로`(1) + 주요 `영수증 저장`(2)

## 3. AI에게 줄 요청문 예시

```
루트의 DESIGN.md를 읽고, app/shop/page.tsx에 1-3의 className과 2절 /shop 기준을 입혀줘.
기능과 데이터 코드는 바꾸지 말고 스타일만 바꿔줘. 이모지나 아이콘은 넣지 마.
다 하면 375px 폭에서 가로 스크롤이 없는지 확인하는 방법을 알려줘.
```
