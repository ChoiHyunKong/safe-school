import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "안전한학교 - SafeSchool",
  description: "학교폭력 통계를 투명하게 공개하여 학부모와 학생의 안전한 학교 선택을 지원합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="layout-container">
          {/* 좌측 사이드바 - 10% */}
          <Sidebar />

          {/* 메인 컨텐츠 - 좌측 12% 간격 */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
