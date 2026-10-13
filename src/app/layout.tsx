import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "월간 파레트 - 스케치북 가계부",
  description: "손글씨와 크레파스 감성을 담은 AI 스마트 가계부 월간 파레트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Dodum&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex justify-center items-start p-2 sm:p-4 md:p-8">
        {children}
      </body>
    </html>
  );
}
