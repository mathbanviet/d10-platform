"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  FileText,
  Palette,
  PlaySquare,
  Flame,
  Trophy,
  Search,
  Mic,
  Sparkles,
  ArrowRight,
  Scissors,
  Layers,
  Headphones,
  Compass,
  Zap,
  CheckCircle2,
  LockOpen,
} from "lucide-react";

interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  category: "studio" | "pdf" | "media" | "social" | "life";
  badge: string;
  badgeColor: string;
  href: string;
  status: "ready" | "beta" | "coming";
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const D10_APPS: AppItem[] = [
  {
    id: "camera-studio",
    title: "Wuta & B612 Camera Studio",
    subtitle: "Chụp ảnh làm đẹp AI, quay video bài giảng 60FPS, chèn sticker & khung hình trực tiếp.",
    category: "studio",
    badge: "Đang hoạt động",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    href: "/camera-studio",
    status: "ready",
    icon: <Camera className="w-7 h-7 text-pink-400" />,
    gradient: "from-pink-600/20 via-rose-500/10 to-slate-900",
    features: ["Mịn da AI 60FPS", "10 Filter Wuta", "Quay Video WebM", "0đ Server"],
  },
  {
    id: "pdf-studio",
    title: "iLovePDF Điểm 10+ (Cắt & Gộp PDF)",
    subtitle: "Cắt trang đề cương, gộp nhiều file PDF, chuyển ảnh chụp vở sang PDF siêu tốc ngay trên trình duyệt.",
    category: "pdf",
    badge: "Sẵn sàng mở",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    href: "/pdf-studio",
    status: "ready",
    icon: <Scissors className="w-7 h-7 text-red-400" />,
    gradient: "from-red-600/20 via-orange-500/10 to-slate-900",
    features: ["Cắt lẻ trang PDF", "Gộp file PDF", "Ảnh sang PDF", "Bảo mật 100%"],
  },
  {
    id: "ichat-ai",
    title: "iChat - Lưới Lượng Tử Đa Vũ Trụ",
    subtitle: "Trợ lý AI giải bài tập chuẩn SGK Kết nối tri thức Lớp 6 - 12 với tốc độ phản hồi gấp 3 lần.",
    category: "life",
    badge: "Đang hoạt động",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    href: "/ichat",
    status: "ready",
    icon: <Sparkles className="w-7 h-7 text-amber-400" />,
    gradient: "from-blue-600/20 via-indigo-500/10 to-slate-900",
    features: ["Chuẩn SGK 6-12", "Vẽ đồ thị & Hình học", "Giải chi tiết", "Gemini 3.8 / Argon"],
  },
  {
    id: "canva-capcut-edu",
    title: "Canva & CapCut Edu Studio",
    subtitle: "Thiết kế sơ đồ tư duy, flashcard công thức, tạo ảnh bìa bài giảng và quay màn hình thuyết trình.",
    category: "media",
    badge: "Giai đoạn 2",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    href: "/media-studio",
    status: "beta",
    icon: <Palette className="w-7 h-7 text-purple-400" />,
    gradient: "from-purple-600/20 via-fuchsia-500/10 to-slate-900",
    features: ["Kéo thả Fabric.js", "Mẫu Flashcard Toán/Lý", "Quay màn hình", "Xuất PNG/MP4"],
  },
  {
    id: "edutok-lofi",
    title: "EduShorts & Phòng Học Lofi Spotify",
    subtitle: "Lướt video ngắn 60s mẹo giải nhanh Toán - Anh và nghe nhạc Lofi tập trung kèm đồng hồ Pomodoro.",
    category: "social",
    badge: "Giai đoạn 3",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    href: "/edutok",
    status: "beta",
    icon: <Headphones className="w-7 h-7 text-cyan-400" />,
    gradient: "from-cyan-600/20 via-teal-500/10 to-slate-900",
    features: ["Video ngắn học tập", "Nhạc Lofi không lời", "Đồng hồ Pomodoro", "Không quảng cáo"],
  },
  {
    id: "duolingo-streak",
    title: "Thử Thách Duolingo 5 Phút & Tiện Ích",
    subtitle: "Luyện phản xạ trắc nghiệm 5 phút mỗi ngày để giữ chuỗi lửa Streak, tích điểm đổi quà tại Điểm 10+.",
    category: "life",
    badge: "Giai đoạn 3",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    href: "/daily-streak",
    status: "beta",
    icon: <Flame className="w-7 h-7 text-orange-400" />,
    gradient: "from-amber-600/20 via-orange-500/10 to-slate-900",
    features: ["Chuỗi Streak hàng ngày", "Bảng xếp hạng", "Ghi chú giọng nói AI", "Chạy Offline"],
  },
];

export default function AppsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [streakDays, setStreakDays] = useState<number>(5);
  const [expPoints, setExpPoints] = useState<number>(450);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Đồng bộ Streak & EXP tại trình duyệt (Offline-first & Zero-friction)
  useEffect(() => {
    const savedStreak = localStorage.getItem("d10_streak");
    const savedExp = localStorage.getItem("d10_exp");
    if (savedStreak) setStreakDays(Number(savedStreak));
    if (savedExp) setExpPoints(Number(savedExp));
  }, []);

  // Tìm kiếm bằng giọng nói (Voice Search tiêu chuẩn 2026)
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói trực tiếp.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const filteredApps = D10_APPS.filter((app) => {
    const matchCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* TOP HEADER & GAMIFICATION BAR (CHUỖI STREAK DUOLINGO) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 p-6 md:p-8 rounded-3xl border border-blue-500/20 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>HỆ SINH THÁI SIÊU ỨNG DỤNG ĐIỂM 10+ (2026)</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Apps & Ứng Dụng Thông Minh
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2">
              Trải nghiệm ngay lập tức không cần đăng nhập phức tạp. Xử lý trực tiếp bằng AI,
              tối ưu đa thiết bị (Điện thoại, iPad, Laptop) và hoàn toàn miễn phí.
            </p>
          </div>

          {/* Gamification Widget: Streak & EXP */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/10 self-stretch lg:self-auto justify-around">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
              <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
                <Flame className="w-6 h-6 fill-orange-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Chuỗi chăm chỉ</p>
                <p className="text-xl font-black text-orange-400">{streakDays} Ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Điểm năng lượng</p>
                <p className="text-xl font-black text-amber-300">{expPoints} EXP</p>
              </div>
            </div>
          </div>
        </div>

        {/* THANH TÌM KIẾM GIỌNG NÓI & BỘ LỌC DANH MỤC */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Các nút lọc danh mục */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: "all", label: "Tất cả (6)" },
              { id: "studio", label: "Camera Studio" },
              { id: "pdf", label: "iLovePDF Công cụ" },
              { id: "media", label: "Sáng tạo Canva/Video" },
              { id: "social", label: "Giải trí & Lofi" },
              { id: "life", label: "Học tập & Đời sống" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm kèm Micro giọng nói */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm ứng dụng (VD: cắt PDF, camera...)"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleVoiceSearch}
              title="Tìm kiếm bằng giọng nói"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LƯỚI HIỂN THỊ CÁC ỨNG DỤNG (APP CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`group relative rounded-3xl bg-gradient-to-br ${app.gradient} border border-slate-800 hover:border-blue-500/50 p-6 flex flex-col justify-between gap-6 shadow-xl hover:-translate-y-1 transition-all duration-200`}
            >
              <div>
                {/* Hàng trên: Icon & Nhãn trạng thái */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 shadow-inner">
                    {app.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border ${app.badgeColor}`}
                  >
                    {app.badge}
                  </span>
                </div>

                {/* Tên & Mô tả */}
                <h2 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition">
                  {app.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{app.subtitle}</p>

                {/* Danh sách tính năng nổi bật */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {app.features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-950/60 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nút mở ứng dụng ngay (Zero-friction onboarding) */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <LockOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Dùng ngay không cần đăng nhập
                </span>

                <Link
                  href={app.href}
                  onClick={() => {
                    const nextExp = expPoints + 10;
                    setExpPoints(nextExp);
                    localStorage.setItem("d10_exp", String(nextExp));
                  }}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
                >
                  <span>Mở App</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}