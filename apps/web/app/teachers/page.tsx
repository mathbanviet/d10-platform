import Link from 'next/link';

export default function TeachersPage() {
  // Dữ liệu mẫu (Sau này Thầy tạo bảng 'teachers' trên Supabase thì mình hút ra y như Trang chủ)
  const teachers = [
    { id: 1, name: 'Thầy Phúc Huy', subject: 'Toán học', grade: 'THPT - Luyện thi Đại học', tag: 'toan' },
    { id: 2, name: 'Cô Hà Phương', subject: 'Ngữ văn', grade: 'THCS - Luyện thi vào 10', tag: 'van' },
    { id: 3, name: 'Thầy Tấn Hành', subject: 'Toán học', grade: 'Luyện thi Đại học', tag: 'toan' },
    { id: 4, name: 'Cô Thanh Thúy', subject: 'Tiếng Anh', grade: 'Giải đề chuyên sâu', tag: 'anh' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* HEADER DÙNG CHUNG */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-yellow-400">ĐIỂM 10+</span> ONLINE
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 font-medium">
            <Link href="/" className="hover:text-yellow-300 transition-colors">Trang chủ</Link>
            <Link href="/courses" className="hover:text-yellow-300 transition-colors">Khóa học</Link>
            <Link href="/teachers" className="hover:text-yellow-300 border-b-2 border-yellow-300 pb-1">Giáo viên</Link>
            <Link href="/documents" className="hover:text-yellow-300 transition-colors">Kho tài liệu</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* BANNER GIÁO VIÊN */}
      <section className="bg-blue-800 text-white py-16 text-center border-b-4 border-yellow-400">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-4">Đội ngũ Giáo viên Điểm 10+</h1>
          <p className="text-lg text-blue-200">Những người lái đò tâm huyết, tận tâm và giàu kinh nghiệm luyện thi.</p>
        </div>
      </section>

      {/* NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* BỘ LỌC MÔN HỌC */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md">Tất cả môn</button>
          <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition">Toán học</button>
          <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition">Ngữ văn</button>
          <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition">Tiếng Anh</button>
          <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition">Vật Lý</button>
        </div>

        {/* LƯỚI DANH SÁCH GIÁO VIÊN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teachers.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-28 h-28 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-300 font-bold text-2xl border-4 border-blue-50">
                Ảnh
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
              <p className="text-blue-600 font-bold text-sm mb-2">{teacher.subject}</p>
              <p className="text-gray-500 text-sm mb-5">{teacher.grade}</p>
              <button className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition">
                Xem hồ sơ
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}