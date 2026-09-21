import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* BANNER TRANG CHỦ */}
      <section className="bg-blue-600 text-white py-24 px-4 text-center">
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
            <Link 
              href="/exam" 
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-colors shadow-lg"
            >
              Làm bài kiểm tra NL
            </Link>
          </div>
        </div>
      </section>

      {/* CHƯƠNG TRÌNH ĐÀO TẠO TRỌNG TÂM */}
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