import Link from "next/link";

// --- COMPONENT PHÁT VIDEO YOUTUBE ---
const YouTubePlayer = ({ youtubeId, title }: { youtubeId: string, title: string }) => {
  if (!youtubeId) return <div className="p-10 text-center bg-gray-100 rounded-lg">Video đang cập nhật</div>;
  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-black" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// --- GIAO DIỆN PHÒNG HỌC CHÍNH ---
export default async function LessonPlayerPage({ params }: { params: Promise<{ gradeId: string, subjectSlug: string, courseSlug: string }> }) {
  // Lấy dữ liệu từ URL
  const { gradeId, subjectSlug } = await params;
  
  const formatName = (slug: string) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* 1. Thanh điều hướng (Breadcrumb) */}
      <div className="mb-6 text-sm text-gray-500 font-medium flex items-center space-x-2">
        <Link href="/courses" className="hover:text-blue-600">Khóa học</Link>
        <span>/</span>
        <Link href={`/courses/${gradeId}/${subjectSlug}`} className="hover:text-blue-600">
          Môn {formatName(subjectSlug)}
        </Link>
        <span>/</span>
        <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded">Vào phòng học</span>
      </div>

      {/* 2. Layout Bố cục 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (70%) - Video & Tài liệu */}
        <div className="lg:col-span-2">
          
          {/* Trình phát Video (Thay ID YouTube của Thầy vào đây) */}
          <div className="mb-6">
            <YouTubePlayer youtubeId="dQw4w9WgXcQ" title="Bài 1: Khái quát chung" />
          </div>

          {/* Thông tin bài học & Tabs */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Bài 1: Giới thiệu và Hướng dẫn học tập
            </h1>
            <div className="text-sm text-gray-600 mb-6 flex flex-wrap items-center gap-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">👨‍🏫 Thầy Phúc Huy</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">⏱ 45 phút</span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button className="border-blue-500 text-blue-600 py-4 px-1 border-b-2 font-bold text-sm">
                  Tài liệu đính kèm (PDF)
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 border-b-2 font-medium text-sm">
                  Hỏi đáp & Bình luận
                </button>
              </nav>
            </div>
            
            {/* Nội dung Tab Tài liệu */}
            <div className="pt-6">
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tài liệu bài giảng hôm nay gồm tóm tắt lý thuyết trọng tâm và 50 bài tập trắc nghiệm chọn lọc. Các em học viên nhấn tải file PDF bên dưới, in ra để luyện tập song song cùng video nhé.
              </p>
              <button className="bg-blue-50 text-blue-700 px-5 py-3 rounded-xl text-sm font-bold border border-blue-200 flex items-center space-x-2 hover:bg-blue-100 hover:shadow-md transition-all">
                <span className="text-lg">⬇️</span>
                <span>Tải xuống: BTTL_Bai1_ThayHuy.pdf</span>
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (30%) - Danh sách bài học */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            
            <div className="bg-blue-600 p-5 text-white">
              <h2 className="font-bold text-lg">Nội dung khóa học</h2>
              <p className="text-blue-100 text-sm mt-1">Tiến độ: 1/15 bài giảng</p>
              {/* Thanh tiến độ */}
              <div className="w-full bg-blue-800 rounded-full h-1.5 mt-3">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto">
              {/* Bài đang học */}
              <div className="p-4 border-b border-gray-100 bg-blue-50 cursor-pointer flex items-start space-x-3">
                <div className="mt-1 text-blue-600 text-lg">▶️</div>
                <div>
                  <p className="font-bold text-blue-800 text-sm">Bài 1: Giới thiệu chung</p>
                  <p className="text-xs text-blue-600 mt-1">45:00 • Đang học</p>
                </div>
              </div>
              
              {/* Bài chưa học */}
              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3 transition-colors opacity-75">
                <div className="mt-1 text-gray-400 text-lg">🔒</div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Bài 2: Chuyên đề chuyên sâu phần 1</p>
                  <p className="text-xs text-gray-500 mt-1">50:00 • Chưa mở khóa</p>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start space-x-3 transition-colors opacity-75">
                <div className="mt-1 text-gray-400 text-lg">🔒</div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Bài 3: Luyện giải đề thực tế</p>
                  <p className="text-xs text-gray-500 mt-1">35:00 • Chưa mở khóa</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}