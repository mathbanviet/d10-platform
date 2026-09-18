import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Đổi thành async function để trang chủ có thể chờ lấy dữ liệu từ Supabase
export default async function HomePage() {
  
  // LỆNH GỌI DỮ LIỆU: Hút toàn bộ khóa học từ bảng 'courses'
  const { data: courses } = await supabase.from('courses').select('*');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* HEADER */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 rounded bg-blue-500 hover:bg-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-yellow-400">ĐIỂM 10+</span> ONLINE
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 font-medium">
            <Link href="/" className="hover:text-yellow-300 border-b-2 border-yellow-300 pb-1">Trang chủ</Link>
            <Link href="/courses" className="hover:text-yellow-300 transition-colors">Khóa học</Link>
            <Link href="/teachers" className="hover:text-yellow-300 transition-colors">Giáo viên</Link>
            <Link href="/documents" className="hover:text-yellow-300 transition-colors">Kho tài liệu</Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <span className="hidden lg:inline-flex items-center font-bold text-yellow-300 mr-4">
              📞 0933 39 87 87
            </span>
            <Link href="/login" className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* BANNER CHÍNH */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 py-16 text-center text-white border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Học mọi lúc - Vươn xa cùng <span className="text-yellow-400 text-6xl">SỐ</span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 font-medium">
            Nền tảng học tập và luyện thi trực tuyến chuyên sâu môn Toán học, Ngữ văn & Tiếng Anh.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition shadow-lg">
              Đăng ký học ngay
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition shadow-lg">
              Làm bài kiểm tra NL
            </button>
          </div>
        </div>
      </section>

      {/* CÁC CHƯƠNG TRÌNH TRỌNG TÂM */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-blue-800 mb-12 uppercase tracking-wide">
          Chương trình đào tạo trọng tâm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-blue-500 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 mb-4">Luyện thi THPT Quốc Gia</h4>
            <p className="text-gray-600 text-center mb-6">Lộ trình ôn thi bài bản từ mất gốc đến điểm 9+. Cập nhật cấu trúc đề thi 2025.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-green-500 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 mb-4">Luyện thi vào 10 chuyên</h4>
            <p className="text-gray-600 text-center mb-6">Củng cố nền tảng cấp THCS, rèn kỹ năng giải đề tốc độ cho các trường TOP.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-orange-500 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-center text-gray-800 mb-4">Đánh giá Năng lực (HSA/APT)</h4>
            <p className="text-gray-600 text-center mb-6">Luyện đề Tư duy Định lượng, Định tính và Khoa học tự nhiên bài bản.</p>
          </div>
        </div>
      </main>

      {/* KHÓA HỌC ĐANG MỞ ĐĂNG KÝ (DỮ LIỆU ĐỘNG TỪ SUPABASE) */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-end mb-10 border-b-2 border-gray-200 pb-4">
             <h3 className="text-2xl font-bold text-gray-800">Khóa học đang mở đăng ký</h3>
             <Link href="/courses" className="text-blue-600 font-semibold hover:text-blue-800">Xem tất cả</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Lệnh Duyệt (Map) mảng dữ liệu khóa học để in ra các thẻ */}
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                    <div className="h-40 bg-blue-100 relative flex items-center justify-center overflow-hidden">
                      {/* Lấy ảnh khóa học nếu có, nếu không thì hiển thị nền xanh */}
                      {course.image_url && course.image_url.startsWith('http') ? (
                         <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-blue-300 font-bold text-xl opacity-50">10+</span>
                      )}
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
                    </div>
                    <div className="p-4">
                      {/* Lấy tên khóa học từ Supabase */}
                      <h4 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600 mb-2 cursor-pointer h-12">
                        {course.title}
                      </h4>
                      {/* Lấy tên giáo viên từ Supabase */}
                      <p className="text-sm text-gray-600 mb-3 font-medium">Giáo viên: {course.teacher_name}</p>
                      
                      <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
                        <span className="text-blue-600 font-bold hover:underline cursor-pointer">Chi tiết &rarr;</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-4">Hệ thống đang cập nhật dữ liệu khóa học...</p>
              )}

           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-lg font-bold mb-4">VỀ ĐIỂM 10+</h4>
            <p className="text-sm mb-4">Hệ thống giáo dục trực tuyến hàng đầu, chuyên bồi dưỡng văn hóa và luyện thi đại học.</p>
            <p className="text-sm">Hotline: <span className="text-yellow-400 font-bold">0933 39 87 87</span></p>
          </div>
          <div>
             <h4 className="text-white text-lg font-bold mb-4">LIÊN KẾT NHANH</h4>
             <ul className="space-y-2 text-sm">
               <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
               <li><a href="#" className="hover:text-white">Quy chế hoạt động</a></li>
               <li><a href="#" className="hover:text-white">Điều khoản bảo mật</a></li>
             </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          © 2026 ĐIỂM 10+ ONLINE. Mọi bản quyền được bảo lưu.
        </div>
      </footer>
      
    </div>
  );
}