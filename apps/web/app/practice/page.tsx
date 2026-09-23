"use client";

import { useState } from 'react';
import Link from 'next/link';

// DỮ LIỆU CẤU TRÚC CHƯƠNG TRÌNH TOÁN 12 - KẾT NỐI TRI THỨC
const CURRICULUM = [
  {
    id: 1,
    title: "Chương 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
    stats: "7 bài học • 70 bài tập",
    lessons: [
      {
        id: 101,
        title: "Bài 1: Tính đơn điệu và cực trị của hàm số",
        stats: "18 bài tập",
        tests: [
          { slug: 'toan-12-kntt-bai-1-test-1', name: '20 câu Trắc nghiệm Toán 12 Bài 1: Tính đơn điệu và cực trị của hàm số (Cơ bản)' },
          { slug: 'toan-12-kntt-bai-1-test-2', name: '12 bài tập Vận dụng: Sử dụng bảng biến thiên, đồ thị hàm số để tìm cực trị' },
          { slug: 'toan-12-kntt-bai-1-test-3', name: 'Một số bài toán thực tế ứng dụng tính đơn điệu và cực trị (Vận dụng cao)' }
        ]
      },
      {
        id: 102,
        title: "Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số",
        stats: "15 bài tập",
        tests: [
          { slug: 'toan-12-kntt-bai-2-test-1', name: '15 câu Trắc nghiệm tìm GTLN, GTNN trên một đoạn' }
        ]
      },
      {
        id: 199,
        title: "Đề kiểm tra cuối Chương 1",
        stats: "2 đề",
        tests: [
          { slug: 'toan-12-kntt-chuong-1-test-tong-hop', name: 'Đề thi trắc nghiệm tổng hợp Chương 1 (40 câu - 45 phút)' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Chương 2: Vectơ và hệ tọa độ trong không gian",
    stats: "5 bài học • 43 bài tập",
    lessons: [
      {
        id: 201,
        title: "Bài 6: Vectơ trong không gian",
        stats: "12 bài tập",
        tests: [
          { slug: 'toan-12-kntt-bai-6-test-1', name: 'Trắc nghiệm lý thuyết và bài tập Vectơ trong không gian' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Chương 3: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm",
    stats: "4 bài học • 21 bài tập",
    lessons: []
  }
];

export default function PracticeMenuPage() {
  // Quản lý trạng thái mở/đóng của các Chương (Accordion)
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({ 1: true }); // Mặc định mở Chương 1

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      
      {/* HEADER TẠM THỜI CỦA TRANG */}
      <div className="bg-blue-600 text-white shadow-md py-4 px-6 flex items-center justify-between z-10 relative">
        <div className="text-2xl font-black tracking-wider">ĐIỂM 10+ ONLINE</div>
        <div className="hidden md:flex gap-6 font-bold text-sm uppercase">
          <Link href="/" className="hover:text-blue-200 transition">Trang chủ</Link>
          <Link href="/courses" className="hover:text-blue-200 transition">Khóa học</Link>
          <Link href="/teachers" className="hover:text-blue-200 transition">Giáo viên</Link>
          <Link href="/practice" className="text-yellow-300 border-b-2 border-yellow-300 pb-1">Phòng luyện</Link>
        </div>
        <button className="bg-white text-blue-600 font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition shadow">Đăng nhập</button>
      </div>

      <div className="flex flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* SIDEBAR BÊN TRÁI: CHỌN LỚP */}
        <div className="hidden md:flex w-64 flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-500 text-xs uppercase tracking-wider">
              Chương trình
            </div>
            <div className="flex flex-col py-2 text-gray-700 font-medium">
              {[6, 7, 8, 9, 10, 11].map(grade => (
                <button key={grade} className="flex items-center px-6 py-3 hover:bg-gray-50 text-left transition">
                  <span className="w-6 h-6 rounded-full border border-gray-300 mr-3 flex items-center justify-center text-xs"></span>
                  Lớp {grade}
                </button>
              ))}
              <button className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-bold text-left transition">
                <span className="w-6 h-6 rounded-full border-2 border-blue-600 mr-3 flex items-center justify-center text-xs">✓</span>
                Lớp 12
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-bold text-red-500 hover:bg-red-50 cursor-pointer transition flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Đăng xuất
          </div>
        </div>

        {/* KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Box Tiêu đề */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
            <div className="flex items-center text-sm text-gray-500 font-medium mb-3 gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>Lớp 12</span> <span className="text-gray-300">❯</span> <span>Môn Toán</span> <span className="text-gray-300">❯</span> <span className="text-gray-900 font-bold">Kết nối tri thức</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Toán 12 - Kết nối tri thức</h1>
            <p className="text-gray-500 font-medium">Biên soạn theo chương trình GDPT 2018</p>
            
            {/* Box thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-800">6</div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Chủ đề</div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-800">32</div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Bài học</div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-800">250+</div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Bài tập</div>
                </div>
              </div>
            </div>
          </div>

          {/* DANH SÁCH CHƯƠNG VÀ BÀI TẬP (ACCORDION) */}
          <div className="flex flex-col gap-4">
            {CURRICULUM.map((chapter) => {
              const isExpanded = expandedChapters[chapter.id];

              return (
                <div key={chapter.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Tiêu đề Chương */}
                  <button 
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${isExpanded ? 'bg-purple-600' : 'bg-gray-300'}`}>
                        {isExpanded ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{chapter.title}</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">{chapter.stats}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-gray-100 text-gray-600 items-center justify-center font-bold text-sm">
                      {chapter.lessons.length}
                    </div>
                  </button>

                  {/* Nội dung xổ xuống (Các bài học và Đề test) */}
                  {isExpanded && chapter.lessons.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-col gap-6">
                      {chapter.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded bg-pink-100 text-pink-600 flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                              <p className="text-xs text-gray-500 font-medium">{lesson.stats}</p>
                            </div>
                          </div>

                          {/* Danh sách các bài Test con */}
                          <div className="pl-11 flex flex-col gap-2">
                            {lesson.tests?.map((test, idx) => (
                              <Link 
                                key={idx}
                                href={`/practice/${test.slug}`} 
                                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm group transition"
                              >
                                <div className="flex items-center gap-3">
                                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{test.name}</span>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}