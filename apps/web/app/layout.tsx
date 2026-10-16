import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import AuthModal from "./AuthModal";
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
  title: "Điểm 10⁺ Online | Hệ thống học tập",
  description: "Nền tảng học trực tuyến chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={geistSans.variable + " " + geistMono.variable}>
        
        {/* HEADER DÙNG CHUNG CHO MỌI TRANG */}
        <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 lg:px-4 py-3 flex items-center justify-between gap-3">
            {/* Logo (Thêm shrink-0 để không bao giờ bị dính vào chữ Trang chủ) */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="text-xl lg:text-2xl font-bold tracking-wider cursor-pointer whitespace-nowrap">
                <span className="text-yellow-400">ĐIỂM 10⁺</span> ONLINE
              </Link>
            </div>
            
            {/* Menu (Tối ưu khoảng cách để chứa đủ 9 mục + nút Lớp Live trên 1 dòng) */}
            <nav className="hidden md:flex items-center space-x-3 lg:space-x-4 text-sm lg:text-[15px] font-medium whitespace-nowrap overflow-x-auto">
              <Link href="/" className="hover:text-yellow-300 transition-colors">Trang chủ</Link>
              <Link href="/about" className="hover:text-yellow-300 transition-colors">Giới thiệu</Link>
              <Link href="/courses" className="hover:text-yellow-300 transition-colors">Khóa học</Link>
              <Link href="/practice" className="text-yellow-300 font-bold drop-shadow-sm">Phòng luyện</Link>
              <Link
                href="/live-class"
                className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded-full font-bold shadow-xs transition-colors flex items-center gap-1"
              >
                <span>🎥 Lớp Live</span>
              </Link>
              <Link href="/teachers" className="hover:text-yellow-300 transition-colors">Giáo viên</Link>
              <Link href="/ichat" className="hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold">
                iChat - Hỏi đáp AI
              </Link>
              <Link href="/guide" className="hover:text-yellow-300 transition-colors">Hướng dẫn Đăng ký</Link>
              <a href="https://d10hub.io.vn" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">Tài liệu</a>
            </nav>
            
            {/* Nút Đăng nhập thông minh (Thêm shrink-0 để tên học sinh không bị ép gãy dòng) */}
            <div className="flex items-center shrink-0 whitespace-nowrap">
              <AuthModal />
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
