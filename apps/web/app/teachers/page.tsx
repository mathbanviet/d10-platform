"use client";

import Link from 'next/link';
import { useState } from 'react';

// Dữ liệu giáo viên từ file "Danh sách giáo viên Điểm 10"
const teachers = [
  { 
    slug: 'thay-phuc-huy-domingo', 
    name: 'Thầy Phúc Huy Domingo', 
    role: 'Giáo viên Toán & Tin học', 
    image: 'https://ui-avatars.com/api/?name=Phuc+Huy&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: Hệ thống Điểm 10+ & Trung tâm Tinhocnewsky',
    stats: { courses: 15, students: '5.2K+' },
    subjects: ['Toán THPT', 'Tin học'],
    filterSubject: ['toan', 'tin'], filterGrade: ['thpt', 'thcs']
  },
  { 
    slug: 'co-than-thi-ha-phuong', 
    name: 'Cô Thân Thị Hà Phương', 
    role: 'Sư phạm Ngữ văn', 
    image: 'https://ui-avatars.com/api/?name=Ha+Phuong&background=047857&color=fff&size=512',
    slogan: 'Đơn vị công tác: THCS Thông Tây Hội - Quận Gò Vấp',
    stats: { courses: 8, students: '2.1K+' },
    subjects: ['Ngữ văn'],
    filterSubject: ['van'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-ta-the-thach', 
    name: 'Thầy Tạ Thế Thạch', 
    role: 'Sư Phạm Hoá', 
    image: 'https://ui-avatars.com/api/?name=The+Thach&background=be185d&color=fff&size=512',
    slogan: 'Đơn vị công tác: THCS Nguyễn Hồng Đào, Hóc Môn',
    stats: { courses: 6, students: '1.5K+' },
    subjects: ['Hóa học'],
    filterSubject: ['hoa'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-ngo-minh-hien', 
    name: 'Thầy Ngô Minh Hiền', 
    role: 'Ngôn ngữ Anh', 
    image: 'https://ui-avatars.com/api/?name=Minh+Hien&background=ea580c&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trung tâm anh ngữ',
    stats: { courses: 12, students: '3.2K+' },
    subjects: ['Tiếng Anh'],
    filterSubject: ['anh'], filterGrade: ['thcs', 'thpt']
  },
  { 
    slug: 'thay-nguyen-do-minh-tuan', 
    name: 'Thầy Nguyễn Đỗ Minh Tuấn', 
    role: 'Thạc sĩ Toán giải tích', 
    image: 'https://ui-avatars.com/api/?name=Minh+Tuan&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: THCS - THPT Nguyễn Khuyến',
    stats: { courses: 10, students: '4.8K+' },
    subjects: ['Toán học'],
    filterSubject: ['toan'], filterGrade: ['thcs', 'thpt']
  },
  { 
    slug: 'thay-khuong-thoi-hoan-duy', 
    name: 'Thầy Khương T. Hoàn Duy', 
    role: 'Thạc sĩ Lý thuyết xác suất & thống kê', 
    image: 'https://ui-avatars.com/api/?name=Hoan+Duy&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: Học viện hàng không Việt Nam',
    stats: { courses: 7, students: '2.4K+' },
    subjects: ['Toán học'],
    filterSubject: ['toan'], filterGrade: ['thpt']
  },
  { 
    slug: 'thay-nguyen-quoc-cuong', 
    name: 'Thầy Nguyễn Quốc Cường', 
    role: 'Thạc sĩ Toán', 
    image: 'https://ui-avatars.com/api/?name=Quoc+Cuong&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường ĐH Công Nghiệp Thực Phẩm TPHCM',
    stats: { courses: 9, students: '3.1K+' },
    subjects: ['Toán học'],
    filterSubject: ['toan'], filterGrade: ['thpt']
  },
  { 
    slug: 'thay-vo-van-the', 
    name: 'Thầy Võ Văn Thế', 
    role: 'Thạc sĩ Toán ứng dụng', 
    image: 'https://ui-avatars.com/api/?name=Van+The&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trung tâm Điểm 10+',
    stats: { courses: 14, students: '4.5K+' },
    subjects: ['Toán học'],
    filterSubject: ['toan'], filterGrade: ['thcs', 'thpt']
  },
  { 
    slug: 'thay-nguyen-truong-huy', 
    name: 'Thầy Nguyễn Trường Huy', 
    role: 'Sư Phạm Hoá', 
    image: 'https://ui-avatars.com/api/?name=Truong+Huy&background=be185d&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường Nam Việt',
    stats: { courses: 8, students: '2.3K+' },
    subjects: ['Hóa học'],
    filterSubject: ['hoa'], filterGrade: ['thpt']
  },
  { 
    slug: 'co-le-thi-viet-hoa', 
    name: 'Cô Lê Thị Việt Hoa', 
    role: 'Thạc sĩ Hóa, Thạc sĩ Kỹ thuật', 
    image: 'https://ui-avatars.com/api/?name=Viet+Hoa&background=be185d&color=fff&size=512',
    slogan: 'Đơn vị công tác: Đại học Sư Phạm TP.HCM, ĐH Bách Khoa',
    stats: { courses: 11, students: '3.8K+' },
    subjects: ['Hóa học'],
    filterSubject: ['hoa'], filterGrade: ['thpt']
  },
  { 
    slug: 'co-tran-thi-kim-hoa', 
    name: 'Cô Trần Thị Kim Hòa', 
    role: 'Cử nhân sư phạm Tiếng Anh', 
    image: 'https://ui-avatars.com/api/?name=Kim+Hoa&background=ea580c&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường TNPT Phùng Hưng',
    stats: { courses: 9, students: '2.6K+' },
    subjects: ['Tiếng Anh'],
    filterSubject: ['anh'], filterGrade: ['thpt']
  },
  { 
    slug: 'thay-nguyen-kim-thanh', 
    name: 'Thầy Nguyễn Kim Thành', 
    role: 'Cử Nhân SP Khoa Học Tự Nhiên', 
    image: 'https://ui-avatars.com/api/?name=Kim+Thanh&background=16a34a&color=fff&size=512',
    slogan: 'Đơn vị công tác: KUMON Việt Nam',
    stats: { courses: 7, students: '1.9K+' },
    subjects: ['Khoa học Tự nhiên'],
    filterSubject: ['khtn'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-lau-minh-phuc', 
    name: 'Thầy Lầu Minh Phúc', 
    role: 'Thạc Sĩ Khoa Học Vật Chất', 
    image: 'https://ui-avatars.com/api/?name=Minh+Phuc&background=0284c7&color=fff&size=512',
    slogan: 'Đơn vị công tác: TT Kỹ Thuật Hướng Nghiệp Lê Thị Hồng Gấm',
    stats: { courses: 6, students: '1.7K+' },
    subjects: ['Vật lý'],
    filterSubject: ['ly'], filterGrade: ['thpt']
  },
  { 
    slug: 'thay-ta-hung-nam', 
    name: 'Thầy Tạ Hùng Nam', 
    role: 'Sư phạm Vật Lý', 
    image: 'https://ui-avatars.com/api/?name=Hung+Nam&background=0284c7&color=fff&size=512',
    slogan: 'Đơn vị công tác: THPT Võ Văn Kiệt',
    stats: { courses: 9, students: '2.8K+' },
    subjects: ['Vật lý'],
    filterSubject: ['ly'], filterGrade: ['thpt']
  },
  { 
    slug: 'co-tran-thi-ngoc-tam', 
    name: 'Cô Trần Thị Ngọc Tâm', 
    role: 'Văn học Việt Nam - Ngữ văn', 
    image: 'https://ui-avatars.com/api/?name=Ngoc+Tam&background=047857&color=fff&size=512',
    slogan: 'Đơn vị công tác: THCS Nguyễn Văn Trỗi',
    stats: { courses: 8, students: '2.2K+' },
    subjects: ['Ngữ văn'],
    filterSubject: ['van'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-huynh-thanh-nam', 
    name: 'Thầy Huỳnh Thanh Nam', 
    role: 'Thạc sĩ hóa hữu cơ', 
    image: 'https://ui-avatars.com/api/?name=Thanh+Nam&background=be185d&color=fff&size=512',
    slogan: 'Đơn vị công tác: Công Ty cổ phần DC Technology',
    stats: { courses: 5, students: '1.4K+' },
    subjects: ['Hóa học'],
    filterSubject: ['hoa'], filterGrade: ['thpt']
  },
  { 
    slug: 'co-tran-thi-cam-ly', 
    name: 'Cô Trần Thị Cẩm Ly', 
    role: 'Thạc sĩ Ngôn ngữ & văn hóa VN', 
    image: 'https://ui-avatars.com/api/?name=Cam+Ly&background=047857&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường trung cấp Nghề quận 12',
    stats: { courses: 10, students: '3.0K+' },
    subjects: ['Ngữ văn'],
    filterSubject: ['van'], filterGrade: ['thpt']
  },
  { 
    slug: 'co-dinh-thi-ngoc', 
    name: 'Cô Đinh Thị Ngọc', 
    role: 'Thạc sĩ Khoa học Giáo dục', 
    image: 'https://ui-avatars.com/api/?name=Thi+Ngoc&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường THCS An Phú Đông',
    stats: { courses: 9, students: '2.7K+' },
    subjects: ['Toán học'],
    filterSubject: ['toan'], filterGrade: ['thcs']
  },
  { 
    slug: 'co-do-thi-thu-huong', 
    name: 'Cô Đỗ Thị Thu Hường', 
    role: 'Cử nhân sư phạm hóa', 
    image: 'https://ui-avatars.com/api/?name=Thu+Huong&background=be185d&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường THCS Nguyễn Hồng Đào',
    stats: { courses: 7, students: '2.1K+' },
    subjects: ['Hóa học'],
    filterSubject: ['hoa'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-huynh-cong-minh', 
    name: 'Thầy Huỳnh Công Minh', 
    role: 'Sư phạm Vật Lý & Toán', 
    image: 'https://ui-avatars.com/api/?name=Cong+Minh&background=0284c7&color=fff&size=512',
    slogan: 'Đơn vị công tác: Trường trung cấp Nghề quận 12',
    stats: { courses: 12, students: '3.6K+' },
    subjects: ['Vật lý', 'Toán học'],
    filterSubject: ['ly', 'toan'], filterGrade: ['thpt']
  },
  { 
    slug: 'thay-bien-ngoc-danh', 
    name: 'Thầy Biện Ngọc Danh', 
    role: 'Sư phạm vật lí', 
    image: 'https://ui-avatars.com/api/?name=Ngoc+Danh&background=0284c7&color=fff&size=512',
    slogan: 'Đơn vị công tác: THCS Bình Lợi Trung',
    stats: { courses: 8, students: '2.4K+' },
    subjects: ['Vật lý'],
    filterSubject: ['ly'], filterGrade: ['thcs']
  },
  { 
    slug: 'thay-nguyen-van-huy', 
    name: 'Thầy Nguyễn Văn Huy', 
    role: 'Cử Nhân Toán - Tin Học', 
    image: 'https://ui-avatars.com/api/?name=Van+Huy&background=1d4ed8&color=fff&size=512',
    slogan: 'Đơn vị công tác: CĐ Bách Khoa SG, Ngoại Ngữ NewSky',
    stats: { courses: 10, students: '3.1K+' },
    subjects: ['Toán', 'Tin học'],
    filterSubject: ['toan', 'tin'], filterGrade: ['thpt']
  }
];

export default function TeachersPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Lọc danh sách giáo viên
  const filteredTeachers = teachers.filter(teacher => {
    const matchSubject = selectedSubject === 'all' || teacher.filterSubject.includes(selectedSubject);
    const matchGrade = selectedGrade === 'all' || teacher.filterGrade.includes(selectedGrade);
    return matchSubject && matchGrade;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* BANNER GIÁO VIÊN */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Đội ngũ Giáo viên Điểm 10+ Online
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Hội tụ những người thầy tận tâm, giàu kinh nghiệm, đồng hành cùng các em học sinh trên con đường chinh phục tri thức và đạt kết quả cao nhất.
          </p>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        
        {/* BỘ LỌC KIỂU DROPDOWN CHUẨN HOCMAI */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 bg-white p-5 rounded-2xl shadow-md border border-gray-100 w-full md:w-fit mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-bold hidden md:inline-block">Lọc danh sách:</span>
            
            {/* Dropdown Môn học */}
            <div className="relative">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-auto"
              >
                <option value="all">-- Chọn Môn học --</option>
                <option value="toan">Toán học</option>
                <option value="van">Ngữ văn</option>
                <option value="anh">Tiếng Anh</option>
                <option value="hoa">Hóa học</option>
                <option value="ly">Vật lý</option>
                <option value="khtn">Khoa học Tự nhiên</option>
                <option value="tin">Tin học</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Dropdown Lớp học */}
            <div className="relative">
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-auto"
              >
                <option value="all">-- Chọn Cấp học --</option>
                <option value="thcs">Khối THCS</option>
                <option value="thpt">Khối THPT</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

          </div>
        </div>

        {/* THÔNG BÁO NẾU KHÔNG TÌM THẤY */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-10 text-gray-500 font-medium">
            Không tìm thấy giáo viên phù hợp với bộ lọc hiện tại.
          </div>
        )}

        {/* LƯỚI DANH SÁCH GIÁO VIÊN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeachers.map(teacher => (
            <div key={teacher.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
              
              {/* Ảnh Giáo viên */}
              <div className="h-64 bg-gray-200 overflow-hidden relative">
                <img 
                  src={teacher.image} 
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Thông tin */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-4 line-clamp-1" title={teacher.role}>{teacher.role}</p>
                
                {/* Môn giảng dạy */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.subjects.map((sub, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Đơn vị công tác */}
                <p className="text-gray-600 italic text-sm mb-6 flex-grow">
                  {teacher.slogan}
                </p>

                {/* Thống kê */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                  <div className="text-center">
                    <span className="block font-bold text-gray-800">{teacher.stats.courses}</span>
                    <span className="text-xs text-gray-500">Khóa học</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-800">{teacher.stats.students}</span>
                    <span className="text-xs text-gray-500">Học viên</span>
                  </div>
                </div>

                {/* Nút Xem chi tiết */}
                <Link 
                  href={`/teachers/${teacher.slug}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-auto"
                >
                  Xem chi tiết hồ sơ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}