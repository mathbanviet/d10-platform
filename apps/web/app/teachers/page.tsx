import Link from 'next/link';

export default function TeachersPage() {
  // Dữ liệu giáo viên được nâng cấp thêm ảnh, slogan và thống kê
  const teachers = [
    { 
      slug: 'thay-phuc-huy', 
      name: 'Thầy Phúc Huy', 
      role: 'Giáo viên Toán & Tin học', 
      image: 'https://ui-avatars.com/api/?name=Phuc+Huy&background=1d4ed8&color=fff&size=512',
      slogan: '"Học Toán bằng tư duy logic, chinh phục điểm 10+ dễ dàng. Thành thạo kỹ năng số cùng IC3 và Scratch."',
      stats: { courses: 15, students: '5.2K+' },
      subjects: ['Toán THPT', 'Tin học IC3', 'Scratch'],
      tag: 'toan' 
    },
    { 
      slug: 'co-ha-phuong', 
      name: 'Cô Hà Phương', 
      role: 'Giáo viên Ngữ văn', 
      image: 'https://ui-avatars.com/api/?name=Ha+Phuong&background=047857&color=fff&size=512',
      slogan: '"Đánh thức vẻ đẹp ngôn từ, chinh phục mọi kỳ thi bằng cảm xúc và tư duy mạch lạc."',
      stats: { courses: 8, students: '3.1K+' },
      subjects: ['Văn THCS', 'Luyện thi vào 10'],
      tag: 'van' 
    },
    { 
      slug: 'thay-tan-hanh', 
      name: 'Thầy Tấn Hành', 
      role: 'Giáo viên Toán học', 
      image: 'https://ui-avatars.com/api/?name=Tan+Hanh&background=ea580c&color=fff&size=512',
      slogan: '"Biến những con số khô khan thành công cụ sắc bén để bước vào cánh cửa Đại học."',
      stats: { courses: 12, students: '4.8K+' },
      subjects: ['Toán THPT', 'Luyện thi Đại học'],
      tag: 'toan' 
    },
    { 
      slug: 'co-thanh-thuy', 
      name: 'Cô Thanh Thúy', 
      role: 'Giáo viên Tiếng Anh', 
      image: 'https://ui-avatars.com/api/?name=Thanh+Thuy&background=9333ea&color=fff&size=512',
      slogan: '"Phá bỏ rào cản ngôn ngữ, tự tin giao tiếp và đạt điểm tuyệt đối trong các kỳ thi."',
      stats: { courses: 10, students: '2.5K+' },
      subjects: ['Tiếng Anh THPT', 'Giải đề chuyên sâu'],
      tag: 'anh' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* BANNER GIÁO VIÊN */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Đội ngũ Giáo viên Điểm 10+
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            Hội tụ những người lái đò tâm huyết, giàu kinh nghiệm, đồng hành cùng các em học sinh trên con đường chinh phục tri thức.
          </p>
        </div>
      </section>

      {/* NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        
        {/* BỘ LỌC MÔN HỌC */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md">Tất cả môn</button>
          <button className="bg-white text-gray-600 border border-gray-200 px-6 py-2 rounded-full font-medium hover:bg-blue-50 hover:text-blue-600 transition">Toán học</button>
          <button className="bg-white text-gray-600 border border-gray-200 px-6 py-2 rounded-full font-medium hover:bg-blue-50 hover:text-blue-600 transition">Ngữ văn</button>
          <button className="bg-white text-gray-600 border border-gray-200 px-6 py-2 rounded-full font-medium hover:bg-blue-50 hover:text-blue-600 transition">Tiếng Anh</button>
        </div>

        {/* LƯỚI DANH SÁCH GIÁO VIÊN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map(teacher => (
            <div key={teacher.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              {/* Ảnh Giáo viên */}
              <div className="h-56 bg-gray-200 overflow-hidden relative">
                <img 
                  src={teacher.image} 
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Thông tin */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                <p className="text-blue-600 font-semibold text-sm mb-4">{teacher.role}</p>
                
                {/* Môn giảng dạy (Tags) */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.subjects.map((sub, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-100">
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Slogan */}
                <p className="text-gray-600 italic text-sm mb-6 line-clamp-3 flex-grow">
                  {teacher.slogan}
                </p>

                {/* Thống kê */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-5">
                  <div className="text-center">
                    <span className="block font-bold text-gray-800">{teacher.stats.courses}</span>
                    <span className="text-xs text-gray-500 font-medium">Khóa học</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-800">{teacher.stats.students}</span>
                    <span className="text-xs text-gray-500 font-medium">Học viên</span>
                  </div>
                </div>

                {/* Nút Xem hồ sơ */}
                <Link 
                  href={`/teachers/${teacher.slug}`}
                  className="block w-full text-center bg-gray-50 text-blue-600 border border-blue-100 font-bold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Xem hồ sơ
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}