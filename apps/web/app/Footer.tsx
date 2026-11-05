"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#004d95" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#004d95] text-white font-sans mt-auto">
      {/* Phần nội dung chính 4 cột */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* CỘT 1: THÔNG TIN CÔNG TY */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-lg bg-white text-[#004d95] flex items-center justify-center font-black text-2xl shadow-md">
                S
              </div>
              <div className="flex flex-col">
                <div className="flex items-start">
                  <span className="text-2xl font-extrabold tracking-tight text-white leading-none">
                    Schooli.vn
                  </span>
                  <span className="text-[10px] font-bold ml-0.5 -mt-0.5">®</span>
                </div>
                <span className="text-[11px] text-blue-200 italic tracking-wide mt-0.5">
                  Học tập không giới hạn
                </span>
              </div>
            </Link>

            <h3 className="text-[15px] font-bold uppercase tracking-wide text-white pt-2 leading-snug">
              CÔNG TY TNHH TRƯỜNG HỌC TRỰC TUYẾN SCHOOLI
            </h3>

            <p className="text-sm text-blue-100 leading-relaxed">
              Mã số doanh nghiệp: 0318750540 cấp tại Sở KH&ĐT Thành phố Hồ Chí Minh.
            </p>

            <ul className="space-y-2.5 text-sm text-blue-50 pt-1">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white shrink-0 fill-current" />
                <a
                  href="tel:0939580787"
                  className="hover:text-amber-300 transition-colors"
                >
                  0939580787
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a
                  href="mailto:schooli@gmail.com"
                  className="hover:text-amber-300 transition-colors"
                >
                  schooli@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
                <span className="leading-relaxed">
                  386/52 Bis, đường Lê Văn Sỹ, Phường 14, Quận 3, Thành phố Hồ Chí Minh.
                </span>
              </li>
            </ul>

            {/* Các nút mạng xã hội */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#3b5998] hover:opacity-90 flex items-center justify-center text-white shadow transition"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#0077b5] hover:opacity-90 flex items-center justify-center text-white shadow transition"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#cd201f] hover:opacity-90 flex items-center justify-center text-white shadow transition"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* CỘT 2: VỀ CHÚNG TÔI */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              VỀ CHÚNG TÔI
            </h4>
            <ul className="divide-y divide-white/15 text-sm">
              {[
                { label: "Giới thiệu", href: "/about" },
                { label: "Tầm nhìn", href: "/about#tam-nhin" },
                { label: "Sứ mệnh", href: "/about#su-menh" },
                { label: "Khóa học", href: "/courses" },
              ].map((item, idx) => (
                <li key={idx} className="py-2.5 first:pt-0">
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-blue-50 hover:text-amber-300 hover:translate-x-1 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: DỊCH VỤ */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              DỊCH VỤ
            </h4>
            <ul className="divide-y divide-white/15 text-sm">
              {[
                { label: "Tài liệu bài giảng", href: "/courses" },
                { label: "Học online", href: "/live-class" },
                { label: "Tự Học qua bài giảng video", href: "/practice" },
              ].map((item, idx) => (
                <li key={idx} className="py-2.5 first:pt-0">
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-blue-50 hover:text-amber-300 hover:translate-x-1 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 4: FANPAGE */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              FANPAGE
            </h4>
            <div className="bg-white rounded-sm p-3 text-slate-800 shadow-md max-w-[260px]">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                <div className="w-12 h-12 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 font-black text-[#004d95] text-lg">
                  A
                </div>
                <div className="overflow-hidden">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1877f2] hover:underline text-sm block truncate"
                  >
                    AiTechco.vn
                  </a>
                  <span className="text-xs text-slate-500 block">
                    12 người theo dõi
                  </span>
                </div>
              </div>
              <div className="pt-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#f5f6f7] hover:bg-[#ebedf0] border border-[#ccd0d5] text-[#4b4f56] text-xs font-semibold px-2.5 py-1 rounded-sm transition"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
                  <span>Theo dõi Trang</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Thanh Bản Quyền Dưới Cùng */}
      <div className="w-full bg-[#003d7a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-blue-200 space-y-1 text-center sm:text-left">
            <p>© 2026 Schooli. All rights reserved.</p>
            <p>Thuộc bản quyền CÔNG TY TNHH TRƯỜNG HỌC TRỰC TUYẾN SCHOOLI</p>
          </div>

          <button
            onClick={scrollToTop}
            title="Lên đầu trang"
            className="w-9 h-9 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition cursor-pointer shrink-0"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}