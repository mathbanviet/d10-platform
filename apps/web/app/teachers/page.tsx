/* eslint-disable @next/next/no-img-element */
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Khai báo kiểu dữ liệu
interface Teacher {
  slug: string;
  name: string;
  role: string;
  image: string;
  slogan: string;
  stats: {
    courses: string;
    students: string;
  };
  subjects: string[];
  filterSubject: string[];
  filterGrade: string[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjdYHhNTm00PIA9BEBwTUu9ZinkRQ-VfdaPm3qDvXpqGYkhPMX_4dz3vkvXB38a4sDL_Ezm_zZ2tcp/pub?output=tsv';
    
    fetch(sheetUrl)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const data: Teacher[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          // BÍ QUYẾT TRỊ TYPESCRIPT: Gán vào biến 'line' trước khi xử lý
          const line = lines[i]; 
          
          if (!line || !line.trim()) continue;
          
          const cols = line.split('\t');
          
          data.push({
            slug: cols[0] ? String(cols[0]).trim() : '',
            name: cols[1] ? String(cols[1]).trim() : 'Giáo viên',
            role: cols[2] ? String(cols[2]).trim() : 'Đang cập nhật',
            image: cols[3] ? String(cols[3]).trim() : 'https://via.placeholder.com/512',
            slogan: cols[4] ? String(cols[4]).trim() : '',
            stats: { 
              courses: cols[5] ? String(cols[5]).trim() : '0', 
              students: cols[6] ? String(cols[6]).trim() : '0' 
            },
            subjects: cols[7] ? String(cols[7]).split(',').map(s => s.trim()) : [],
            filterSubject: cols[8] ? String(cols[8]).split(',').map(s => s.trim()) : [],
            filterGrade: cols[9] ? String(cols[9]).split(',').map(s => s.trim()) : []
          });
        }
        setTeachers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải:", err);
        setLoading(false);
      });
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchSubject = selectedSubject === 'all' || (Array.isArray(teacher.filterSubject) && teacher.filterSubject.includes(selectedSubject));
    const matchGrade = selectedGrade === 'all' || (Array.isArray(teacher.filterGrade) && teacher.filterGrade.includes(selectedGrade));
    return matchSubject && matchGrade;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Đội ngũ Giáo viên Điểm 10+ Online</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Hội tụ những người thầy tận tâm, giàu kinh nghiệm, đồng hành cùng các em học sinh trên con đường chinh phục tri thức.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 bg-white p-5 rounded-2xl shadow-md border border-gray-100 w-full md:w-fit mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-bold hidden md:inline-block">Lọc danh sách:</span>
            <div className="relative">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-auto"
              >
                <option value="all">-- Chọn Môn học --</option>
                <option value="toan">Toán học</option>
                <option value="van">Ngữ văn</option>
                <option value="anh">Tiếng Anh</option>
                <option value="hoa">Hóa học</option>
                <option value="ly">Vật lý</option>
                <option value="khtn">Khoa học Tự nhiên</option>
                <option value="tin">Tin học</option>
              </select>
            </div>
            <div className="relative">
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-auto"
              >
                <option value="all">-- Chọn Cấp học --</option>
                <option value="thcs">Khối THCS</option>
                <option value="thpt">Khối THPT</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Đang tải dữ liệu từ Google Sheets...</p>
          </div>
        ) : (
          <>
            {filteredTeachers.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium">Không tìm thấy giáo viên phù hợp.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTeachers.map((teacher, idx) => (
                <div key={teacher.slug || idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                  <div className="h-64 bg-gray-200 overflow-hidden relative">
                    <img 
                      src={teacher.image || 'https://via.placeholder.com/512'} 
                      alt={teacher.name || 'Ảnh giáo viên'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-4 line-clamp-1" title={teacher.role}>{teacher.role}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.map((sub: string, i: number) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">{sub}</span>
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-sm mb-6 flex-grow">{teacher.slogan}</p>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                      <div className="text-center">
                        <span className="block font-bold text-gray-800">{teacher.stats?.courses || 0}</span>
                        <span className="text-xs text-gray-500">Khóa học</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="text-center">
                        <span className="block font-bold text-gray-800">{teacher.stats?.students || 0}</span>
                        <span className="text-xs text-gray-500">Học viên</span>
                      </div>
                    </div>
                    <Link 
                      href={`/teachers/${teacher.slug || '#'}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-auto"
                    >
                      Xem chi tiết hồ sơ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}