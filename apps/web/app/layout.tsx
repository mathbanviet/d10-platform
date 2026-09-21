import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Điểm 10+ Online | Hệ thống học tập",
  description: "Nền tảng học trực tuyến chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* HEADER DÙNG CHUNG CHO MỌI TRANG */}
        <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold tracking-wider cursor-pointer">
                <span className="text-yellow-400">ĐIỂM 10+</span> ONLINE
              </Link>
            </div>
            
            {/* Menu */}
            <nav className="hidden md:flex items-center space-x-6 font-medium">
              <Link href="/" className="hover:text-yellow-300 transition-colors">Trang chủ</Link>
              <Link href="/courses" className="hover:text-yellow-300 transition-colors">Khóa học</Link>
              <Link href="/teachers" className="hover:text-yellow-300 transition-colors">Giáo viên</Link>
              <Link href="/documents" className="hover:text-yellow-300 transition-colors">Tài liệu</Link>
            </nav>
            
            {/* Nút Đăng nhập */}
            <div className="flex items-center space-x-3">
              <Link href="/login" className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                Đăng nhập
              </Link>
            </div>
          </div>
        </header>

        {/* NỘI DUNG TỪNG TRANG SẼ ĐƯỢC HIỂN THỊ Ở ĐÂY */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

      </body>
    </html>
  );
}