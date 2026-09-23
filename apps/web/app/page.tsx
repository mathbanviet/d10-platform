"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";

// 1. DANH SÁCH ẢNH BANNER 
const BANNERS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop',
    alt: 'Môi trường học tập chuyên nghiệp'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2000&auto=format&fit=crop',
    alt: 'Luyện thi THPT Quốc gia'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2000&auto=format&fit=crop',
    alt: 'Đội ngũ giáo viên tận tâm'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. LOGIC TỰ ĐỘNG CHUYỂN ẢNH SAU MỖI 5 GIÂY
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? BANNERS.length - 1 : prev - 1));

  return (
    <>
      {/* ================= PHẦN 1: BANNER SLIDER TỰ ĐỘNG ================= */}
      <div className="relative w-full h-[250px] md:h-[450px] lg:h-[550px] overflow-hidden group">
        
        {/* Các lớp ảnh mờ dần (Fade in/out) */}
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img 
              src={banner.url} 
              alt={banner.alt} 
              className="w-full h-full object-cover"
            />
            {/* Phủ một lớp đen mờ mờ */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        ))}

        {/* Nút bấm Sang Trái */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white bg-opacity-40 hover:bg-opacity-100 text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 pr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Nút bấm Sang Phải */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white bg-opacity-40 hover:bg-opacity-100 text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 pl-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Các dấu chấm tròn (Dots) báo hiệu vị trí ảnh */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full shadow-sm ${
                idx === currentSlide 
                  ? 'w-8 h-2.5 bg-blue-600' 
                  : 'w-2.5 h-2.5 bg-white bg-opacity-70 hover:bg-opacity-100'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* ================= PHẦN 2: THÔNG ĐIỆP TRANG CHỦ (Của Thầy giữ nguyên) ================= */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto mt-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide">
            Học mọi lúc - Vươn xa cùng <span className="text-yellow-400">SỐ</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 text-blue-100">
            Nền tảng học tập và luyện thi trực tuyến chuyên sâu môn Toán học, Ngữ văn & Tiếng Anh.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/courses" 
              className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Đăng ký học ngay
            </Link>
            {/* Đã cập nhật link vào /practice (Phòng luyện) thay vì /exam để khớp cấu trúc hệ thống */}
            <Link 
              href="/practice" 
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-colors shadow-lg"
            >
              Làm bài kiểm tra NL
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PHẦN 3: CHƯƠNG TRÌNH ĐÀO TẠO TRỌNG TÂM (Của Thầy giữ nguyên) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-12 uppercase tracking-wide">
            Chương trình đào tạo trọng tâm
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Thẻ 1: THPT Quốc Gia */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🎓
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Luyện thi THPT Quốc Gia</h3>
              <p className="text-gray-600 text-sm">
                Lộ trình ôn thi toàn diện, bám sát cấu trúc đề thi của Bộ GD&ĐT giúp học sinh tự tin đạt điểm cao.
              </p>
            </div>

            {/* Thẻ 2: Vào 10 Chuyên */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🌟
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Luyện thi vào 10 chuyên</h3>
              <p className="text-gray-600 text-sm">
                Trang bị kiến thức chuyên sâu và kỹ năng giải đề tốc độ cho các mục tiêu trường chuyên, lớp chọn.
              </p>
            </div>

            {/* Thẻ 3: Đánh giá năng lực */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Đánh giá năng lực (HSA/APT)</h3>
              <p className="text-gray-600 text-sm">
                Rèn luyện tư duy logic, phân tích số liệu và giải quyết vấn đề đa chiều cho các kỳ thi riêng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}