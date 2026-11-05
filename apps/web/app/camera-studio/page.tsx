// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Camera,
  Video,
  Square,
  Trash2,
  Download,
  Sparkles,
  FlipHorizontal,
  Wand2,
  Eye,
  Scissors,
  Droplet,
  Sun,
  Palette,
  ArrowLeft,
  ShieldCheck,
  Frame,
  Type,
} from "lucide-react";

interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  timestamp: string;
  filterName: string;
}

interface StickerItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

interface FilterPreset {
  id: string;
  name: string;
  badge: string;
  color: string;
  cssFilter: string;
  tintColor?: string;
  blendMode?: GlobalCompositeOperation;
}

interface FrameStyleItem {
  id: string;
  name: string;
  badge: string;
  previewClass: string;
}

interface AspectRatioItem {
  id: string;
  label: string;
  w: number;
  h: number;
}

const DEFAULT_FILTER: FilterPreset = {
  id: "xingtu1",
  name: "Xingtu Trong Trẻo",
  badge: "Hot",
  color: "from-blue-300 to-cyan-400",
  cssFilter: "brightness(1.08) contrast(1.05) saturate(1.1)",
  tintColor: "rgba(186, 230, 253, 0.15)",
  blendMode: "soft-light",
};

const WUTA_FILTERS: FilterPreset[] = [
  { id: "natural", name: "Cam Thường", badge: "Origin", color: "from-slate-500 to-slate-700", cssFilter: "none" },
  DEFAULT_FILTER,
  { id: "peach", name: "Đào Hồng Meitu", badge: "Sweet", color: "from-pink-400 to-rose-500", cssFilter: "brightness(1.1) contrast(1.02) saturate(1.15)", tintColor: "rgba(253, 164, 175, 0.15)", blendMode: "overlay" },
  { id: "milktea", name: "Trà Sữa B612", badge: "Warm", color: "from-amber-300 to-orange-400", cssFilter: "brightness(1.05) sepia(0.2) saturate(1.1)", tintColor: "rgba(252, 211, 77, 0.1)", blendMode: "color-burn" },
  { id: "cyber", name: "Cyberpunk FB", badge: "Neon", color: "from-purple-500 to-indigo-600", cssFilter: "brightness(1.05) contrast(1.2) saturate(1.3)", tintColor: "rgba(168, 85, 247, 0.2)", blendMode: "hue" },
  { id: "cinema", name: "Điện Ảnh Zalo", badge: "Cool", color: "from-cyan-500 to-blue-600", cssFilter: "brightness(0.95) contrast(1.15) saturate(0.9)", tintColor: "rgba(30, 58, 138, 0.2)", blendMode: "hard-light" },
  { id: "bw", name: "Studio Trắng Đen", badge: "Mono", color: "from-zinc-600 to-black", cssFilter: "grayscale(1) contrast(1.25)", blendMode: "source-over" },
];

const FRAME_STYLES: FrameStyleItem[] = [
  { id: "none", name: "Không khung", badge: "Full", previewClass: "border-slate-700 bg-slate-800/60" },
  { id: "polaroid", name: "Polaroid Trắng", badge: "Classic", previewClass: "border-white/80 bg-white/10" },
  { id: "polaroid_pink", name: "Polaroid Sakura", badge: "Cute", previewClass: "border-pink-300 bg-pink-500/20" },
  { id: "instax_sky", name: "Instax Bầu Trời", badge: "Fresh", previewClass: "border-sky-300 bg-sky-500/20" },
  { id: "diem10_gold", name: "Vinh Danh Điểm 10+", badge: "VIP", previewClass: "border-amber-400 bg-blue-900/40" },
  { id: "y2k_window", name: "Cửa Sổ Y2K", badge: "Trend", previewClass: "border-fuchsia-400 bg-fuchsia-500/20" },
  { id: "film_strip", name: "Cuộn Phim Retro", badge: "Kodak", previewClass: "border-amber-500/80 bg-zinc-900" },
  { id: "magazine", name: "Bìa Tạp Chí", badge: "Vogue", previewClass: "border-rose-400 bg-rose-500/20" },
  { id: "cinema", name: "Phim Điện Ảnh", badge: "21:9", previewClass: "border-amber-300/60 bg-black" },
  { id: "viewfinder", name: "Máy Quay REC", badge: "Cam", previewClass: "border-red-400 bg-red-500/10" },
  { id: "neon", name: "Neon TikTok", badge: "Glow", previewClass: "border-cyan-400 bg-purple-900/30" },
  { id: "vintage_gold", name: "Khung Hoàng Gia", badge: "Luxury", previewClass: "border-yellow-500 bg-yellow-500/10" },
];

const DEFAULT_AR: AspectRatioItem = { id: "16:9", label: "16:9", w: 1280, h: 720 };

const ASPECT_RATIOS: AspectRatioItem[] = [
  DEFAULT_AR,
  { id: "4:3", label: "4:3", w: 960, h: 720 },
  { id: "1:1", label: "1:1", w: 720, h: 720 },
  { id: "9:16", label: "9:16", w: 608, h: 1080 },
];

const STICKER_PACK = [
  "💖", "✨", "👑", "🐰", "🔥", "💯", "🌸", "🎀",
  "🎓", "⭐", "🎉", "😎", "🦋", "🍓", "🌈", "🏆",
];

export default function CameraStudioPage() {




























































































































































































































































































































































































































































































































































































































































    <div className="min-h-screen bg-slate-950 text-white py-6 px-4 md:px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Thanh điều hướng quay về Kho Ứng Dụng */}
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Link
            href="/apps-new"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Ứng Dụng</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Wuta & B612 AI Camera Studio • 12 Khung Nghệ Thuật</span>
          </div>
        </div>

        {/* Giao diện Studio chính */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          <video ref={videoRef} playsInline muted className="hidden" />

          {/* CỘT TRÁI: VIEWFINDER & HUD */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center min-h-[500px]">
              {/* TOP HUD */}
              <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-center">
                <span className="text-xs font-bold text-pink-300 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedFilter.name.toUpperCase()}
                </span>
                <div className="flex gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        aspectRatio.id === ar.id
                          ? "bg-pink-500 text-white shadow"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MAIN CANVAS */}
              <div className="relative flex items-center justify-center w-full h-full bg-black overflow-hidden">
                <canvas
                  ref={renderCanvasRef}
                  onMouseDown={handleCanvasPointerDown}
                  onMouseMove={handleCanvasPointerMove}
                  onMouseUp={handleCanvasPointerUp}
                  onMouseLeave={handleCanvasPointerUp}
                  className={`max-h-[540px] w-auto h-auto object-contain cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
                    status === "loading" ? "opacity-0" : "opacity-100"
                  }`}
                />

                {status === "loading" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-30 gap-3">
                    <Camera className="w-12 h-12 text-pink-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-300">Đang khởi tạo AI Camera...</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-30 gap-3 p-6 text-center">
                    <p className="text-sm font-bold text-red-400">
                      Không tìm thấy Camera hoặc chưa cấp quyền trình duyệt.
                    </p>
                    <button
                      onClick={initCamera}
                      className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 rounded-xl text-xs font-bold"
                    >
                      Thử mở lại Camera
                    </button>
                  </div>
                )}

                {flashEffect && <div className="absolute inset-0 bg-white z-40" />}

                {isRecording && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg z-20">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    <span>REC {formatTime(recordSeconds)}</span>
                  </div>
                )}

                {selectedStickerId && (
                  <button
                    onClick={removeSelectedSticker}
                    className="absolute top-20 right-4 bg-red-500/80 backdrop-blur text-white p-2.5 rounded-full shadow-lg hover:bg-red-600 transition z-20"
                    title="Xóa Sticker đang chọn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* BOTTOM HUD / SHUTTER */}
              <div className="absolute bottom-5 inset-x-6 z-20 flex items-center justify-between bg-black/60 backdrop-blur-xl px-6 py-3.5 rounded-3xl border border-white/10">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    title="Lật gương"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    <FlipHorizontal className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSkinSmooth(75);
                      setSkinWhiten(50);
                      setRosyCheeks(40);
                      setLipTint(35);
                      setSlimFace(60);
                      setSelectedFilter(DEFAULT_FILTER);
                    }}
                    title="Làm đẹp tự động"
                    className="p-3 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 transition"
                  >
                    <Wand2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={executeCapturePhoto}
                    title="Chụp ảnh"
                    className="w-16 h-16 rounded-full bg-white p-1.5 shadow-2xl hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                  </button>
                  <button
                    onClick={handleToggleRecord}
                    title="Quay video"
                    className={`w-16 h-16 rounded-full p-1.5 shadow-2xl hover:scale-105 transition-transform ${
                      isRecording ? "bg-red-500/30" : "bg-white"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
                        isRecording ? "bg-red-600 animate-pulse" : "bg-slate-800"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-5 h-5 text-white fill-white" />
                      ) : (
                        <Video className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </button>
                </div>

                <button
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                  title="Nhấn giữ để xem ảnh gốc"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thanh chọn nhanh Khung Ảnh ngay dưới Camera */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5 px-2 shrink-0">
                <Frame className="w-4 h-4" />
                <span>Khung nhanh:</span>
              </span>
              {FRAME_STYLES.map((fr) => (
                <button
                  key={fr.id}
                  onClick={() => setSelectedFrame(fr.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                    selectedFrame === fr.id
                      ? "bg-pink-600 border-pink-400 text-white shadow"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {fr.name}
                </button>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN XINGTU / B612 */}
          <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex bg-slate-950 p-2 border-b border-slate-800 text-[11px] font-black uppercase text-center overflow-x-auto">
              <button
                onClick={() => setActiveTab("creative")}
                className={`flex-1 py-2.5 px-2 rounded-xl transition ${
                  activeTab === "creative" ? "bg-pink-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Khung & Sticker
              </button>
              <button
                onClick={() => setActiveTab("beauty")}
                className={`flex-1 py-2.5 px-2 rounded-xl transition ${
                  activeTab === "beauty" ? "bg-pink-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Làm đẹp
              </button>
              <button
                onClick={() => setActiveTab("makeup")}
                className={`flex-1 py-2.5 px-2 rounded-xl transition ${
                  activeTab === "makeup" ? "bg-pink-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Makeup
              </button>
              <button
                onClick={() => setActiveTab("filters")}
                className={`flex-1 py-2.5 px-2 rounded-xl transition ${
                  activeTab === "filters" ? "bg-pink-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Bộ lọc
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex-1 py-2.5 px-2 rounded-xl transition ${
                  activeTab === "gallery" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Kho ({mediaList.length})
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[540px]">
              {/* TAB KHUNG HÌNH & STICKER */}
              {activeTab === "creative" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-black text-pink-400 uppercase flex items-center gap-1.5">
                        <Frame className="w-4 h-4" />
                        <span>Chọn Khung Ảnh Đẹp (12 Mẫu)</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showDateStamp}
                          onChange={(e) => setShowDateStamp(e.target.checked)}
                          className="accent-pink-500 rounded"
                        />
                        <span>In ngày chụp</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {FRAME_STYLES.map((fr) => (
                        <button
                          key={fr.id}
                          onClick={() => setSelectedFrame(fr.id)}
                          className={`p-2.5 rounded-2xl text-left border transition-all ${
                            selectedFrame === fr.id
                              ? "bg-pink-600/25 border-pink-400 text-white shadow-lg"
                              : `${fr.previewClass} text-slate-300 hover:text-white`
                          }`}
                        >
                          <span
                            className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded inline-block mb-1 ${
                              selectedFrame === fr.id
                                ? "bg-pink-500 text-white"
                                : "bg-slate-900/80 text-pink-300"
                            }`}
                          >
                            {fr.badge}
                          </span>
                          <p className="text-xs font-bold leading-tight">{fr.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dòng chữ kỷ niệm in lên khung */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Type className="w-3.5 h-3.5 text-pink-400" />
                      <span>Dòng chữ kỷ niệm trên khung ảnh:</span>
                    </label>
                    <input
                      type="text"
                      value={frameCaption}
                      onChange={(e) => setFrameCaption(e.target.value)}
                      placeholder="Nhập chữ (VD: Lớp 9A Quyết Thắng • Điểm 10+)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Stickers */}
                  <div>
                    <label className="text-xs font-black text-pink-400 block mb-2 uppercase">
                      Stickers (Bấm để thêm & Kéo thả trên màn hình)
                    </label>
                    <div className="grid grid-cols-8 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      {STICKER_PACK.map((em) => (
                        <button
                          key={em}
                          onClick={() => addSticker(em)}
                          className="text-xl py-1 hover:scale-125 transition-transform hover:bg-slate-800 rounded-xl"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB LÀM ĐẸP */}
              {activeTab === "beauty" && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-pink-400" />
                        <span>Mịn da tự nhiên (Blur/Glow)</span>
                      </span>
                      <span className="text-pink-400">{skinSmooth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skinSmooth}
                      onChange={(e) => setSkinSmooth(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-pink-400" />
                        <span>Trắng sáng (Nâng tone)</span>
                      </span>
                      <span className="text-pink-400">{skinWhiten}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skinWhiten}
                      onChange={(e) => setSkinWhiten(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-pink-400" />
                        <span>Gọn mặt V-Line</span>
                      </span>
                      <span className="text-pink-400">{slimFace}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slimFace}
                      onChange={(e) => setSlimFace(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB MAKEUP */}
              {activeTab === "makeup" && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-rose-400" />
                        <span>Má hồng đào (Blush)</span>
                      </span>
                      <span className="text-rose-400">{rosyCheeks}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={rosyCheeks}
                      onChange={(e) => setRosyCheeks(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span>Son môi (Lip Tint)</span>
                      </span>
                      <span className="text-rose-400">{lipTint}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lipTint}
                      onChange={(e) => setLipTint(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-rose-400" />
                        <span>Mắt to long lanh</span>
                      </span>
                      <span className="text-rose-400">{bigEyes}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bigEyes}
                      onChange={(e) => setBigEyes(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB BỘ LỌC */}
              {activeTab === "filters" && (
                <div className="grid grid-cols-2 gap-3">
                  {WUTA_FILTERS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedFilter(preset)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedFilter.id === preset.id
                          ? "bg-pink-500/20 border-pink-400 text-white shadow-lg"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-black px-2 py-0.5 rounded inline-block mb-1 ${
                          selectedFilter.id === preset.id
                            ? "bg-pink-500 text-white"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {preset.badge}
                      </span>
                      <p className="text-xs font-bold mt-1">{preset.name}</p>
                    </button>
                  ))}

                  <div className="col-span-2 mt-3">
                    <div className="flex justify-between text-xs font-bold text-slate-200 mb-2">
                      <span>Viền đen điện ảnh (Vignette)</span>
                      <span className="text-pink-400">{vignetteVal}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vignetteVal}
                      onChange={(e) => setVignetteVal(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB GALLERY */}
              {activeTab === "gallery" && (
                <div className="flex flex-col gap-3">
                  {mediaList.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <Camera className="w-10 h-10 text-slate-700" />
                      <span className="text-slate-500 text-xs font-bold">
                        Chưa có ảnh/video nào được chụp.
                      </span>
                    </div>
                  ) : (
                    mediaList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-slate-800 p-3 rounded-2xl border border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          {item.type === "photo" ? (
                            <img
                              src={item.url}
                              alt="Shot"
                              className="w-14 h-10 object-cover rounded-xl"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-14 h-10 object-cover rounded-xl"
                            />
                          )}
                          <div>
                            <span className="text-[10px] font-black text-pink-400 uppercase bg-pink-500/10 px-2 py-0.5 rounded">
                              {item.filterName}
                            </span>
                            <p className="text-xs text-slate-300 mt-1 font-semibold">
                              {item.timestamp}
                            </p>
                          </div>
                        </div>
                        <a
                          href={item.url}
                          download={`diem10-${item.id}.${item.type === "photo" ? "jpg" : "webm"}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Tải</span>
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ;
}
// Không còn xuất CameraView trùng tên ở đây nữa