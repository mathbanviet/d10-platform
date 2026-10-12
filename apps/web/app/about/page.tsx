import Link from "next/link";

export const metadata = {
  title: 'Giới thiệu | Hệ thống trung tâm Điểm 10+',
  description: 'Nền tảng học tập và luyện thi trực tuyến chuyên sâu, chất lượng hàng đầu Việt Nam.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans pb-20">
      
      {/* 1. HERO BANNER - TẦM NHÌN & SỨ MỆNH */}
      <div className="relative bg-blue-700 text-white overflow-hidden">
        {/* Pattern nền chìm */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-[1200px] mx-auto px-4 py-20 md:py-28 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Hệ thống giáo dục <br className="hidden md:block" />
              <span className="text-yellow-400">Điểm 10+ Online</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Tiên phong ứng dụng công nghệ vào giáo dục, mang đến giải pháp học tập toàn diện, cá nhân hóa, giúp học sinh chinh phục mọi kỳ thi với kết quả cao nhất.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="font-bold text-2xl text-yellow-400">10+ Năm</div>
                <div className="text-sm text-blue-100">Kinh nghiệm giảng dạy</div>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="font-bold text-2xl text-yellow-400">50.000+</div>
                <div className="text-sm text-blue-100">Học sinh theo học</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md relative">
            {/* Ảnh đại diện giới thiệu */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                alt="Học sinh Điểm 10+" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Khối màu trang trí phía sau ảnh */}
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-yellow-400 rounded-2xl z-0"></div>
          </div>
        </div>
      </div>

      {/* 2. CÂU CHUYỆN & SỨ MỆNH */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-800 mb-6 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
              Được thành lập với tâm huyết của những nhà giáo ưu tú, <strong>Điểm 10+</strong> ra đời mang theo khát vọng xóa nhòa khoảng cách giáo dục giữa các vùng miền. Chúng tôi tin rằng, mọi học sinh đều có quyền được tiếp cận với nguồn tri thức chất lượng cao nhất, phương pháp học tập tiên tiến nhất dù các em ở bất kỳ đâu.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Với nền tảng học trực tuyến thông minh (LMS) kết hợp cùng phương pháp giảng dạy lấy học sinh làm trung tâm, chúng tôi không chỉ truyền đạt kiến thức mà còn thắp sáng ngọn lửa đam mê học tập, rèn luyện tư duy tự học suốt đời cho thế hệ trẻ Việt Nam.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop" alt="Classroom" className="rounded-xl w-full h-48 object-cover shadow-sm" />
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" alt="Study" className="rounded-xl w-full h-48 object-cover shadow-sm mt-8" />
          </div>
        </div>
      </div>

      {/* 3. GIÁ TRỊ CỐT LÕI (CORE VALUES) */}
      <div className="bg-white py-16 md:py-24 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-gray-800 mb-16 uppercase tracking-wide">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center p-8 bg-[#f4f6f8] rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Chất lượng hàng đầu</h3>
              <p className="text-gray-600">Chương trình đào tạo được biên soạn công phu, bám sát cấu trúc đề thi của Bộ GD&ĐT, liên tục cập nhật đổi mới.</p>
            </div>

            <div className="text-center p-8 bg-[#f4f6f8] rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Đội ngũ tận tâm</h3>
              <p className="text-gray-600">Quy tụ đội ngũ Thầy Cô giỏi chuyên môn, giàu kinh nghiệm, luôn sẵn sàng đồng hành và truyền cảm hứng cho học sinh.</p>
            </div>

            <div className="text-center p-8 bg-[#f4f6f8] rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Công nghệ hiện đại</h3>
              <p className="text-gray-600">Nền tảng LMS độc quyền tích hợp AI, tối ưu hóa lộ trình cá nhân, giúp việc học online trở nên sinh động và hiệu quả.</p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION */}
      <div className="max-w-[1000px] mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 md:p-14 text-center shadow-xl text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Sẵn sàng bứt phá điểm số?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Gia nhập cộng đồng Điểm 10+ ngay hôm nay để trải nghiệm môi trường học tập trực tuyến chuẩn quốc tế.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors shadow-lg">
              Đăng ký tài khoản miễn phí
            </Link>
            <Link href="/courses" className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-colors">
              Khám phá Khóa học
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}