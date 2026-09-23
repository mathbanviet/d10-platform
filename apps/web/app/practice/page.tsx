"use client";

import { useState } from 'react';
import Link from 'next/link';

// DỮ LIỆU CẤU TRÚC CHƯƠNG TRÌNH TOÁN 12 - KNTT
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
          { slug: 'toan-12-kntt-bai-1-test-1', name: '20 câu Trắc nghiệm Toán 12 Kết nối tri thức Bài 1: Tính đơn điệu và cực trị của hàm số có đáp án' },
          { slug: 'toan-12-kntt-bai-1-test-2', name: '12 bài tập Sử dụng dấu của đạo hàm để tìm khoảng đồng biến, nghịch biến của hàm số có lời giải' },
          { slug: 'toan-12-kntt-bai-1-test-3', name: '12 bài tập Một số bài toán thực tế ứng dụng tính đơn điệu và cực trị của hàm số có đáp án' }
        ]
      },
      {
        id: 102,
        title: "Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số",
        stats: "15 bài tập",
        tests: [
          { slug: 'toan-12-kntt-bai-2-test-1', name: '15 câu Trắc nghiệm tìm GTLN, GTNN trên một đoạn' }
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
  },
  {
    id: 99,
    title: "Đề cương ôn tập Toán 12 - Kết nối tri thức",
    stats: "2 bài học • 4 bài tập",
    lessons: []
  }
];

// DANH MỤC KHỐI LỚP VÀ MÔN HỌC CHUẨN CỦA ĐIỂM 10+
const GRADES = ['6', '7', '8', '9', '10', '11', '12'];
const SUBJECTS = [
  { id: 'toan', name: 'Toán học', icon: '📐' },
  { id: 'van', name: 'Ngữ văn', icon: '📚' },
  { id: 'anh', name: 'Tiếng Anh', icon: '🌍' },
  { id: 'ly', name: 'Vật lý', icon: '⚡' },
  { id: 'hoa', name: 'Hóa học', icon: '🧪' },
  { id: 'khtn', name: 'Khoa học Tự nhiên', icon: '🌿' },
  { id: 'tin', name: 'Tin học', icon: '💻' }
];

export default function PracticeMenuPage() {
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({ 1: true });
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  const [selectedGrade, setSelectedGrade] = useState('12');
  const [selectedSubject, setSelectedSubject] = useState('toan');

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleAll = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newExpandedState: Record<number, boolean> = {};
    CURRICULUM.forEach(ch => { newExpandedState[ch.id] = newState; });
    setExpandedChapters(newExpandedState);
  };

  const currentSubjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name || 'Môn học';

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col font-sans text-gray-800 pb-20">
      <div className="flex flex-1 max-w-[1500px] w-full mx-auto p-4 md:p-6 pt-6 gap-8">
        
        {/* SIDEBAR BÊN TRÁI NÂNG CẤP MENU SỔ XUỐNG */}
        <div className="hidden md:flex w-64 flex-col gap-6 flex-shrink-0">
          
          {/* Menu công cụ (Tổng quan, Khóa học...) */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Tổng quan
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Khóa học
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Khảo sát
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Flashcard
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Bảng xếp hạng
            </button>
          </div>

          {/* BOX BỘ LỌC CHƯƠNG TRÌNH (SỔ XUỐNG) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-2">
            <div className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Lọc chương trình
            </div>

            {/* Khối lớp */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chọn Khối Lớp</label>
              <div className="relative">
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer hover:bg-gray-100"
                >
                  {GRADES.map(grade => (
                    <option key={grade} value={grade}>Lớp {grade}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Môn học */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chọn Môn Học</label>
              <div className="relative">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer hover:bg-gray-100"
                >
                  {SUBJECTS.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* KHU VỰC NỘI DUNG CHÍNH */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          
          <div className="flex items-center text-sm text-gray-400 font-medium mb-4 gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Lớp {selectedGrade}</span> <span className="text-gray-300">❯</span> <span>{currentSubjectName}</span> <span className="text-gray-300">❯</span> <span className="text-gray-800 font-bold">Kết nối tri thức</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">Kết nối tri thức</h1>
          <p className="text-gray-500 font-medium mb-8">{currentSubjectName} • Lớp {selectedGrade}</p>
          
          {selectedGrade === '12' && selectedSubject === 'toan' ? (
            <>
              {/* 3 Box thống kê */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#eef2ff] text-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-800">9</div>
                    <div className="text-sm text-gray-500 font-medium">Chủ đề</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(236,72,153,0.1)] rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#fdf2f8] text-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-800">46</div>
                    <div className="text-sm text-gray-500 font-medium">Bài học</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#ecfdf5] text-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-800">299</div>
                    <div className="text-sm text-gray-500 font-medium">Bài tập</div>
                  </div>
                </div>
              </div>

              {/* Thanh Search và Mở rộng */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm chủ đề, bài học, bài tập..." 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                  />
                </div>
                <button 
                  onClick={toggleAll}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition whitespace-nowrap shadow-sm"
                >
                  {isAllExpanded ? (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> Thu gọn</>
                  ) : (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> Mở rộng</>
                  )}
                </button>
              </div>

              {/* CÂY THƯ MỤC CHƯƠNG TRÌNH */}
              <div className="flex flex-col gap-3">
                {CURRICULUM.map((chapter) => {
                  const isExpanded = expandedChapters[chapter.id];
                  return (
                    <div key={chapter.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button 
                        onClick={() => toggleChapter(chapter.id)}
                        className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${isExpanded ? 'bg-[#7c3aed]' : 'bg-[#e5e7eb] text-gray-500'}`}>
                            {isExpanded ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            )}
                          </div>
                          <div>
                            <h2 className="text-[15px] font-bold text-gray-800">{chapter.title}</h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">{chapter.stats}</p>
                          </div>
                        </div>
                        <div className="hidden md:flex w-7 h-7 rounded-full bg-[#eef2ff] text-blue-600 items-center justify-center font-bold text-xs">
                          {chapter.lessons.length > 0 ? chapter.lessons.length : chapter.id}
                        </div>
                      </button>

                      {isExpanded && chapter.lessons.length > 0 && (
                        <div className="border-t border-gray-100 bg-white px-5 py-5 flex flex-col gap-6">
                          {chapter.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex flex-col">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center">
                                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800 text-[15px]">{lesson.title}</h3>
                                  <p className="text-xs text-gray-400 mt-0.5">{lesson.stats}</p>
                                </div>
                              </div>
                              <div className="pl-9 flex flex-col">
                                {lesson.tests?.map((test, idx) => (
                                  <Link 
                                    key={idx}
                                    href={`/practice/${test.slug}`} 
                                    className="flex items-center justify-between py-3 border-b border-dashed border-gray-200 hover:bg-gray-50 group transition px-2 rounded -mx-2"
                                  >
                                    <div className="flex items-start gap-3">
                                      <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                      <span className="text-[14px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug pr-4">{test.name}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-transform transform group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-600 mb-2">Đang cập nhật nội dung</h2>
              <p className="text-gray-500 max-w-sm text-center">
                Giáo trình môn <strong className="text-blue-600">{currentSubjectName}</strong> lớp <strong className="text-blue-600">{selectedGrade}</strong> đang được đội ngũ giáo viên Điểm 10+ biên soạn và sẽ sớm ra mắt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}