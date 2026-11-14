import type { Metadata } from "next";
import Header from "@/components/Header";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

export const metadata: Metadata = {
  title: "텅장구조대",
  description: "사고 싶은 거, 다 사세요. 통장은 저희가 지킵니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
