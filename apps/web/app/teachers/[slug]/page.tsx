"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Teacher {
  slug: string;
  name: string;
  role: string;
  image: string;
  slogan: string;
  stats: { courses: string; students: string };
  subjects: string[];
  email: string;
  facebook: string;
}

export default function TeacherDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjdYHhNTm00PIA9BEBwTUu9ZinkRQ-VfdaPm3qDvXpqGYkhPMX_4dz3vkvXB38a4sDL_Ezm_zZ2tcp/pub?output=tsv';

    fetch(sheetUrl)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const dataLines = lines.slice(1);
        let foundTeacher = null;

        for (const line of dataLines) {
          if (!line || typeof line !== 'string' || line.trim() === '') continue;
          
          const cols = line.split('\t');
          const currentSlug = cols[0] ? cols[0].trim() : '';

          if (currentSlug === slug) {
            // Đọc dữ liệu từ cột K (index 10) và L (index 11)
            const rawEmail = cols[10] ? cols[10].trim() : '';
            const rawFacebook = cols[11] ? cols[11].trim() : '';

            foundTeacher = {
              slug: currentSlug,
              name: cols[1] ? cols[1].trim() : 'Giáo viên',
              role: cols[2] ? cols[2].trim() : 'Cử nhân',
              image: cols[3] ? cols[3].trim() : 'https://via.placeholder.com/512',
              slogan: cols[4] ? cols[4].trim() : 'Hệ thống Điểm 10+',
              stats: {
                courses: cols[5] ? cols[5].trim() : '0',
                students: cols[6] ? cols[6].trim() : '0'
              },
              subjects: cols[7] ? cols[7].split(',').map(s => s.trim()) : [],
              // LOGIC THÔNG MINH: Có thì lấy, trống thì tự sinh
              email: rawEmail !== '' ? rawEmail : `gv.${currentSlug}@diem10.edu.vn`,
              facebook: rawFacebook !== '' ? rawFacebook : `https://www.facebook.com/${currentSlug}`
            };
            break;
          }
        }
        setTeacher(foundTeacher);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf0] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070c0] mb-4"></div>
        <p className="text-[#0070c0] font-medium">Đang tải hồ sơ giáo viên...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#fdfaf0] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy giáo viên này</h2>
        <Link href="/teachers" className="bg-[#0070c0] text-white px-6 py-3 rounded hover:bg-blue-700 transition">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf0] pb-24 font-sans">
      
      {/* HEADER QUAY LẠI */}
      <div className="bg-white shadow-sm py-4 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <Link href="/teachers" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại Đội ngũ Giáo viên
          </Link>
        </div>
      </div>

      {/* SECTION 1: NHỮNG CÂU CHUYỆN THÚ VỊ */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-700 uppercase tracking-wider">Những câu chuyện thú vị</h2>
          <div className="flex justify-center mt-3">
            <div className="w-16 h-px bg-gray-400 relative">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row relative items-center justify-center mt-12">
          <div className="w-full md:w-5/12 z-10 relative">
            <img 
              src={teacher.image} 
              alt={teacher.name} 
              className="w-full object-cover shadow-2xl border-4 border-white aspect-square md:aspect-auto md:h-[450px]"
            />
          </div>
          <div className="w-full md:w-7/12 bg-[#fffbc7] p-8 md:p-12 md:pl-24 md:-ml-12 shadow-lg z-0 mt-4 md:mt-0">
            <h3 className="text-[#0070c0] font-bold text-2xl mb-6 uppercase">Đôi nét về {teacher.name.replace('Cô ', '').replace('Thầy ', '')}</h3>
            <p className="text-gray-800 mb-4 leading-relaxed text-justify">
              - Là một giáo viên đầy nhiệt huyết tại Điểm 10+, {teacher.name.toLowerCase().includes('cô') ? 'cô' : 'thầy'} luôn tạo cảm giác thoải mái cho các em học sinh. Nhờ vậy mà lớp học luôn sôi nổi, học sinh tự tin trao đổi về kiến thức, cùng nhau tìm ra nhiều cách giải hay trong học tập.
            </p>
            <p className="text-gray-800 leading-relaxed text-justify">
              - Theo {teacher.name.toLowerCase().includes('cô') ? 'cô' : 'thầy'}, để học tốt môn {teacher.subjects[0] || 'này'}, học sinh cần hiểu sâu về bản chất, nắm kĩ các dạng bài tập trong từng chủ đề. Khi đã hiểu bài và áp dụng làm bài được, học sinh sẽ có thêm động lực và ngày càng yêu thích môn học hơn.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: THÔNG TIN GIÁO VIÊN */}
      <div className="max-w-3xl mx-auto px-4 mt-24">
        <div className="bg-white shadow-xl border border-gray-100 relative pt-14 pb-8 px-8 md:px-16 mt-8">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0070c0] text-white px-8 md:px-16 py-4 text-xl md:text-2xl font-bold uppercase shadow-md whitespace-nowrap">
            Thông tin giáo viên
          </div>

          <div className="space-y-6">
            <div className="flex items-start border-b pb-4">
              <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              <div>
                <p className="text-gray-900 font-bold mb-1">Họ và tên</p>
                <p className="text-gray-600 uppercase">{teacher.name}</p>
              </div>
            </div>

            <div className="flex items-start border-b pb-4">
              <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <div>
                <p className="text-gray-900 font-bold mb-1">Nơi công tác:</p>
                <p className="text-gray-600 uppercase">{teacher.slogan || 'HỆ THỐNG GIÁO DỤC ĐIỂM 10+'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-4">
              <div className="flex items-start">
                <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <div>
                  <p className="text-gray-900 font-bold mb-1">Môn dạy:</p>
                  <p className="text-gray-600 uppercase">{teacher.subjects.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
                <div>
                  <p className="text-gray-900 font-bold mb-1">Học vị:</p>
                  <p className="text-gray-600 uppercase">{teacher.role}</p>
                </div>
              </div>
            </div>

            {/* Hiển thị Email và Facebook động từ Google Sheets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start">
                <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                <div className="overflow-hidden">
                  <p className="text-gray-900 font-bold mb-1">Email:</p>
                  <a href={`mailto:${teacher.email}`} className="text-blue-600 truncate hover:underline block">{teacher.email}</a>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-8 h-8 text-[#0070c0] mr-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <div className="overflow-hidden">
                  <p className="text-gray-900 font-bold mb-1">Facebook:</p>
                  <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate hover:underline block">{teacher.facebook}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: KHÓA HỌC CỦA TÔI */}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-700 uppercase tracking-wider">Khóa học của tôi</h2>
          <div className="flex justify-center mt-3">
            <div className="w-16 h-px bg-gray-400 relative">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="bg-[#0070c0] text-white p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-xl">
          <div className="bg-white text-gray-800 w-full md:w-1/3 shadow-lg flex-shrink-0">
            <div className="bg-[#00b0f0] h-32 relative overflow-hidden flex items-center justify-center">
              <h4 className="text-white font-black text-4xl shadow-sm z-10 uppercase">{teacher.subjects[0] || 'MÔN HỌC'}</h4>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-20 rounded-full"></div>
              <div className="absolute top-2 right-2 bg-white text-[#0070c0] text-xs font-bold px-2 py-1 rounded">Điểm 10+ Class</div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-[#0070c0]">{teacher.subjects[0] || 'Khóa học'} - Học chủ động</h4>
              <p className="text-sm mb-2 text-gray-600">Học phí trọn gói: <span className="font-bold text-gray-900">Liên hệ</span></p>
              <p className="text-sm mb-2 text-gray-600">Ngày khai giảng: <span className="font-bold text-gray-900">Tuyển sinh liên tục</span></p>
              <p className="text-sm mb-6 text-gray-600 border-b pb-4">Giáo viên: {teacher.name}</p>
              <div className="text-right">
                <button className="bg-[#0070c0] text-white px-6 py-2 text-sm font-bold hover:bg-blue-800 transition">Chi tiết</button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h3 className="text-3xl font-bold mb-4">{teacher.subjects[0] || 'Khóa học'} - Nắm chắc nền tảng, bứt phá điểm số</h3>
            <p className="mb-4 text-blue-100">
              Khóa học được xây dựng với nội dung bám sát theo chương trình sách giáo khoa mới, giúp học sinh nắm vững kiến thức cốt lõi.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-blue-50 text-sm md:text-base">
              <li>Trong quá trình học, học sinh sẽ cùng {teacher.name} hoàn thành các nhiệm vụ học tập bám sát thực tế, từ mức độ cơ bản đến vận dụng cao.</li>
              <li>Với mỗi nội dung, giáo viên sẽ từng bước giúp học sinh gắn kiến thức được học vào cuộc sống, để học sinh chủ động chiếm lĩnh tri thức, hình thành năng lực tự học.</li>
              <li>Hệ thống bài tập tự luyện được biên soạn kỹ lưỡng, phân loại rõ ràng giúp học sinh tự tin chinh phục các kỳ thi.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}