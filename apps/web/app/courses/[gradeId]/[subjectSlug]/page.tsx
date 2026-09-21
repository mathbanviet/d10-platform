import Link from "next/link";

// 1. Thêm 'async' vào trước hàm và đổi kiểu params thành Promise
export default async function SubjectPage({ params }: { params: Promise<{ gradeId: string, subjectSlug: string }> }) {
  // 2. Dùng 'await' để chờ hệ thống lấy chính xác chữ 'toan' và 'cap-3' từ URL
  const { gradeId, subjectSlug } = await params;

  // 3. Thêm bước kiểm tra an toàn (nếu không có dữ liệu thì trả về chuỗi rỗng)
  const formatName = (slug: string) => {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      {/* Tiêu đề trang */}
      <div className="mb-10 bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
          Môn {formatName(subjectSlug)} - Khối {formatName(gradeId)}
        </h1>
        <p className="text-gray-600">
          Danh sách các khóa học chuyên sâu được biên soạn bám sát Chương trình GDPT 2018.
        </p>
      </div>

      {/* Danh sách các khóa học (Dạng Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Thẻ Khóa học Mẫu số 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white p-4 text-center">
            <span className="text-4xl mb-2">🎓</span>
            <h3 className="font-bold text-xl line-clamp-2">Học chủ động toàn diện môn {formatName(subjectSlug)}</h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">Chuyên sâu</span>
                <span className="text-gray-500 text-sm flex items-center">⭐ 4.9</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                Tổng hợp toàn bộ kiến thức trọng tâm. Hệ thống bài giảng video trực quan kết hợp file bài tập PDF định dạng chuẩn (có đáp án chi tiết).
              </p>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
              <div className="text-sm text-gray-500 font-medium">
                📚 Giảng viên: Thầy Phúc Huy
              </div>
              <Link 
                href={`/courses/${gradeId}/${subjectSlug}/hoc-chu-dong`}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Vào học ngay
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}