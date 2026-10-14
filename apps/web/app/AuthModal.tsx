"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface UserProfile {
  fullName: string;
  phone: string;
  role: "student" | "parent" | "teacher";
  grade: string;
  school?: string;
}

export default function AuthModal() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"student" | "parent" | "teacher">("student");
  const [grade, setGrade] = useState("Lớp 9 (Ôn vào 10)");
  const [school, setSchool] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("d10_user_profile");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // Bỏ qua nếu lỗi định dạng
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.trim();
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên!");
      return;
    }
    if (!/^(0|\+84)[0-9]{8,10}$/.test(cleanPhone)) {
      setError("Số điện thoại / Zalo chưa đúng (thường có 10 số)!");
      return;
    }

    setSubmitting(true);
    const profile: UserProfile = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      role,
      grade,
      school: school.trim(),
    };

    try {
      localStorage.setItem("d10_user_profile", JSON.stringify(profile));
      setUser(profile);
      setIsOpen(false);

      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...profile,
            timestamp: new Date().toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
          }),
        });
      } catch (err) {
        console.warn("Lỗi kết nối Google Sheets API", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi Điểm 10⁺?")) {
      localStorage.removeItem("d10_user_profile");
      setUser(null);
    }
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2 bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full text-white text-sm backdrop-blur-sm whitespace-nowrap shrink-0">
          <span className="font-bold text-yellow-300 whitespace-nowrap">🎓 {user.fullName}</span>
          <span className="text-xs font-semibold bg-blue-900/70 px-2.5 py-0.5 rounded-full hidden lg:inline-block whitespace-nowrap">
            {user.grade}
          </span>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="text-xs text-blue-200 hover:text-white hover:underline ml-1 whitespace-nowrap"
          >
            Thoát
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-blue-600 hover:bg-yellow-400 hover:text-blue-900 px-5 py-2 rounded-full font-bold shadow-sm transition-colors text-sm whitespace-nowrap shrink-0"
        >
          Đăng nhập
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                    10⁺
                  </span>
                  Đăng nhập Hệ thống
                </h2>
                <p className="text-xs text-blue-100 mt-1.5 opacity-90">
                  Điền thông tin 1 lần duy nhất để mở khóa Phòng luyện & Trợ lý AI
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-xl transition"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleLogin}
              className="p-5 space-y-4 text-sm bg-gray-50/50"
            >
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Bạn đang truy cập với vai trò:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "student", label: "👨‍🎓 Học sinh" },
                    { id: "parent", label: "👪 Phụ huynh" },
                    { id: "teacher", label: "👩‍🏫 Giáo viên" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setRole(item.id as "student" | "parent" | "teacher")
                      }
                      className={
                        "py-2 px-1 rounded-xl font-semibold border text-xs transition duration-200 flex flex-col items-center gap-1 " +
                        (role === item.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-200")
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Khôi"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Số điện thoại / Zalo <span className="text-red-500">*</span>
                  <span className="font-normal text-[11px] text-gray-500 ml-1">
                    (Để nhận tài liệu, kết quả thi)
                  </span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0901234567"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Khối lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 transition cursor-pointer"
                  >
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9 (Ôn vào 10)">Lớp 9 (Ôn vào 10)</option>
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12 (Tốt nghiệp)">Lớp 12 (THPT/ĐGNL)</option>
                    <option value="Giáo sư">👑 Giáo sư (IQ Vô Cực)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Trường học
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="THCS / THPT..."
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : "🚀 Xác nhận & Bắt đầu học"}
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                Bằng việc đăng nhập, bạn đồng ý với các{" "}
                <Link
                  href="/guide"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-500 hover:underline"
                >
                  hướng dẫn & điều khoản
                </Link>{" "}
                của Trung tâm Điểm 10⁺.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
