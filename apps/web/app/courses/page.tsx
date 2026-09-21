import Link from "next/link";

// Dữ liệu danh mục các cấp học và môn học
const CATEGORIES = [
  {
    id: "tieu-hoc",
    title: "Tiểu học",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    subjects: [
      { slug: "toan", name: "Toán", icon: "📐" },
      { slug: "tieng-viet", name: "Tiếng Việt", icon: "📖" },
      { slug: "tieng-anh", name: "Tiếng Anh", icon: "🌍" },
      { slug: "tin-hoc", name: "Tin học", icon: "💻" },
    ]
  },
  {
    id: "cap-2",
    title: "Cấp 2 (THCS)",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    subjects: [
      { slug: "toan", name: "Toán", icon: "📐" },
      { slug: "ngu-van", name: "Ngữ Văn", icon: "📖" },
      { slug: "tieng-anh", name: "Tiếng Anh", icon: "🌍" },
      { slug: "khoa-hoc-tu-nhien", name: "Khoa học Tự nhiên", icon: "🔬" },
      { slug: "tin-hoc", name: "Tin học", icon: "💻" },
    ]
  },
  {
    id: "cap-3",
    title: "Cấp 3 (THPT)",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    subjects: [
      { slug: "toan", name: "Toán", icon: "📐" },
      { slug: "ngu-van", name: "Ngữ Văn", icon: "📖" },
      { slug: "tieng-anh", name: "Tiếng Anh", icon: "🌍" },
      { slug: "vat-ly", name: "Vật lý", icon: "⚡" },
      { slug: "hoa-hoc", name: "Hóa học", icon: "🧪" },
      { slug: "sinh-hoc", name: "Sinh học", icon: "🧬" },
      { slug: "tin-hoc", name: "Tin học", icon: "💻" },
    ]
  }
];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Danh mục Khóa học</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Lộ trình học tập cá nhân hóa, bám sát chương trình GDPT 2018 từ cấp Tiểu học đến THPT Quốc Gia.
        </p>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <div key={category.id} className={`p-8 rounded-2xl border ${category.border} ${category.bg} shadow-sm`}>
            <h2 className={`text-2xl font-bold mb-6 border-b pb-2 ${category.color}`}>
              {category.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.subjects.map((subject) => (
                <Link 
                  key={subject.slug} 
                  href={`/courses/${category.id}/${subject.slug}`}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{subject.icon}</div>
                  <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}