import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hướng dẫn Đăng nhập & Học tập | Điểm 10⁺",
  description: "Cách tham gia hệ thống học tập trực tuyến Điểm 10+",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-8 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Hướng dẫn Đăng ký & Học tập</h1>
          <p className="mt-2 text-blue-100 font-medium">Hệ thống Trung tâm Giáo dục Điểm 10⁺</p>
        </div>
        
        <div className="px-6 py-8 sm:p-10 text-gray-700 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-yellow-400 inline-block mb-4">
              1. Cách Đăng nhập siêu tốc (Không cần mật khẩu)
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-3 leading-relaxed">
              <li>Nhấp vào nút <strong className="text-blue-600">"Đăng nhập"</strong> màu trắng ở góc phải trên cùng màn hình.</li>
              <li>Bạn <strong>không cần phải ghi nhớ tài khoản hay mật khẩu</strong>. Hệ thống chỉ yêu cầu nhập thông tin 1 lần duy nhất trên mỗi thiết bị (Điện thoại, Máy tính).</li>
              <li>Điền đúng <strong>Họ tên, SĐT Zalo</strong> và <strong>Khối Lớp</strong> để Trung tâm có thể gửi điểm thi Phòng luyện và tài liệu học tập PDF phù hợp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-yellow-400 inline-block mb-4">
              2. Khám phá Phòng luyện Thi (Test Bank)
            </h2>
            <p className="mt-2">Sau khi điền thông tin, bạn có thể nhấp vào mục <strong className="text-blue-600">Phòng luyện</strong> trên thanh Menu để làm các bài thi trắc nghiệm Toán, Lý, Hóa, Anh văn... Điểm số sẽ được tự động lưu lại và gửi về Zalo cho Phụ huynh.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-yellow-400 inline-block mb-4">
              3. Cách sử dụng Trợ lý 10⁺ AI
            </h2>
            <p className="mt-2">Trong mục <strong>iChat - Hỏi đáp AI</strong>, hãy nhập rõ ràng đề bài hoặc yêu cầu (Ví dụ: <em>"Giải phương trình x^2 - 4x + 3 = 0"</em> hoặc <em>"Vẽ đồ thị parabol y = x^2"</em>). AI sẽ trình bày từng bước như thầy cô trên lớp và vẽ cả hình minh họa 2D/3D trực quan cho bạn.</p>
          </section>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center mt-8">
            <h3 className="font-bold text-blue-800 mb-2">Bạn cần giáo viên hỗ trợ trực tiếp?</h3>
            <p className="text-sm text-gray-600 mb-4">Đội ngũ giáo viên Điểm 10⁺ luôn sẵn sàng hỗ trợ tư vấn lộ trình học từ Lớp 6 đến Luyện thi Đại học.</p>
            <a href="https://zalo.me/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition shadow-md">
              Chat Zalo với Tư vấn viên
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}