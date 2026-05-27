import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "珍珠奶茶 POS 系統",
  description: "珍珠奶茶店點餐系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
