"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";

// DANH MỤC MENU BÊN TRÁI (Biên soạn riêng cho Điểm 10+)
const SIDEBAR_MENU = [
  { id: 1, title: 'Đánh giá năng lực (HSA/APT)', icon: '🎓', isBold: true },
  { id: 2, title: 'Bồi dưỡng học sinh giỏi', icon: '🏆' },
  { id: 3, title: 'LUYỆN THI THPT QUỐC GIA', icon: '🔥', isBold: true, isUppercase: true },
  { id: 4, title: 'Lớp 10 - Lớp 11 - Lớp 12', icon: '📚' },
  { id: 5, title: 'Luyện thi vào 10 chuyên', icon: '⭐', isBold: true },
  { id: 6, title: 'Lớp 6 - Lớp 7 - Lớp 8 - Lớp 9', icon: '🎒' },
  { id: 7, title: 'Đề thi & Tài liệu miễn phí', icon: '📄' },
];

// BANNER TRƯỢT Ở GIỮA
const BANNERS = [
  { id: 1, url: 'https://i.postimg.cc/zGt47WDP/hoso3.png', alt: 'Khóa học Toàn diện' },
  { id: 2, url: 'https://i.postimg.cc/K8qCfLcp/hocso4.png', alt: 'Luyện thi vào 10' },
  { id: 3, url: 'https://i.postimg.cc/c4ZHGq7J/hocso6.png', alt: 'Luyện thi vào 10' },
  { id: 4, url: 'https://i.postimg.cc/26pc97sw/hocso5.png', alt: 'Đội ngũ giáo viên' }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // LOGIC SLIDER TỰ ĐỘNG
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? BANNERS.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col font-sans pb-20">
      
      {/* ================= HERO SECTION (CẤU TRÚC 3 CỘT KIỂU HOCMAI) ================= */}
      <div className="max-w-[1350px] mx-auto w-full px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[420px]">
          
          {/* CỘT 1: SIDEBAR MENU (Chiếm 3/12) */}
          <div className="hidden lg:flex lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex-col py-3 overflow-hidden">
            {SIDEBAR_MENU.map((item) => (
              <Link 
                key={item.id} 
                href="/courses"
                className={`flex items-center px-5 py-3.5 hover:bg-[#f0f4fb] hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600 ${item.isBold ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}
              >
                <span className="w-7 flex-shrink-0 text-xl opacity-70">{item.icon}</span>
                <span className={`text-[14px] leading-tight ${item.isUppercase ? 'uppercase' : ''}`}>
                  {item.title}
                </span>
              </Link>
            ))}
            <div className="mt-auto px-5 pt-4">
              <Link href="/practice" className="block w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-center font-bold text-sm rounded-lg transition-colors">
                Làm bài test Năng lực
              </Link>
            </div>
          </div>

          {/* CỘT 2: BANNER SLIDER CHÍNH (Chiếm 6/12) */}
          <div className="col-span-1 lg:col-span-6 relative w-full h-[250px] lg:h-full rounded-xl overflow-hidden shadow-sm group border border-gray-200">
            {BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img src={banner.url} alt={banner.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            ))}
            
            <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/70 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <svg className="w-5 h-5 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/70 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <svg className="w-5 h-5 pl-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {BANNERS.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentSlide ? 'w-6 h-2 bg-blue-600' : 'w-2 h-2 bg-white/80'}`}></button>
              ))}
            </div>
          </div>

          {/* CỘT 3: BANNER TĨNH QUẢNG CÁO (Chiếm 3/12) */}
          <div className="hidden lg:block lg:col-span-3 rounded-xl overflow-hidden shadow-sm h-full border border-gray-200">
            <Link href="/courses">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" 
                alt="Banner Quảng cáo" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= DẢI BĂNG THỐNG KÊ MÀU XANH ================= */}
      <div className="max-w-[1350px] mx-auto w-full px-4 mt-6">
        <div className="bg-[#0072bc] rounded-xl flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-7 text-white shadow-md relative overflow-hidden">
          {/* Hiệu ứng nền chìm mờ */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="flex items-center gap-4 mb-6 md:mb-0 relative z-10">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center">
              <span className="text-xl font-black">10+</span>
            </div>
            <div>
              <div className="font-bold text-xl md:text-2xl">Năm kinh nghiệm</div>
              <div className="text-blue-100 text-sm">Giáo dục trực tuyến</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/20 relative z-10"></div>
          
          <div className="flex items-center gap-4 mb-6 md:mb-0 relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <div className="font-bold text-xl md:text-2xl">50.000+</div>
              <div className="text-blue-100 text-sm">Thành viên tham gia</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/20 relative z-10"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <div>
              <div className="font-bold text-xl md:text-2xl uppercase tracking-wide">Điểm 10+ LMS</div>
              <div className="text-blue-100 text-sm">Nền tảng học trực tuyến số 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 3: CHƯƠNG TRÌNH ĐÀO TẠO TRỌNG TÂM ================= */}
      <section className="max-w-[1350px] mx-auto w-full px-4 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 uppercase tracking-wide flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
          Chương trình đào tạo trọng tâm
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Luyện thi THPT Quốc Gia</h3>
            <p className="text-gray-600 text-sm">Lộ trình ôn thi toàn diện, bám sát cấu trúc đề thi của Bộ GD&ĐT giúp học sinh tự tin đạt điểm cao.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌟</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Luyện thi vào 10 chuyên</h3>
            <p className="text-gray-600 text-sm">Trang bị kiến thức chuyên sâu và kỹ năng giải đề tốc độ cho các mục tiêu trường chuyên, lớp chọn.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Đánh giá năng lực (HSA/APT)</h3>
            <p className="text-gray-600 text-sm">Rèn luyện tư duy logic, phân tích số liệu và giải quyết vấn đề đa chiều cho các kỳ thi riêng.</p>
          </div>
        </div>
      </section>
    </div>
  );
}