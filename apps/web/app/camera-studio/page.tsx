// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Camera,
  Video,
  Square,
  Download,
  Sparkles,
  Smile,
  Trash2,
  FlipHorizontal,
  Wand2,
  Eye,
  ArrowLeft,
  Frame,
  Sliders,
  Palette,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  X,
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
  x: number; // Tỷ lệ 0 -> 1 trên canvas
  y: number; // Tỷ lệ 0 -> 1 trên canvas
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

interface FramePreset {
  id: string;
  name: string;
  badge: string;
  borderColor: string;
}

const WUTA_FILTERS: FilterPreset[] = [
  {
    id: "natural",
    name: "Cam Thường",
    badge: "Origin",
    color: "from-slate-600 to-slate-800",
    cssFilter: "none",
  },
  {
    id: "xingtu1",
    name: "Xingtu Trong Trẻo",
    badge: "Hot",
    color: "from-sky-400 to-cyan-600",
    cssFilter: "brightness(1.08) contrast(1.04) saturate(1.12)",
    tintColor: "rgba(200, 235, 255, 0.06)",
    blendMode: "screen",
  },
  {
    id: "peach",
    name: "Đào Hồng Meitu",
    badge: "Sweet",
    color: "from-pink-400 to-rose-600",
    cssFilter: "brightness(1.1) contrast(1.02) saturate(1.18)",
    tintColor: "rgba(255, 182, 193, 0.08)",
    blendMode: "soft-light",
  },
  {
    id: "milktea",
    name: "Trà Sữa B612",
    badge: "Warm",
    color: "from-amber-400 to-orange-600",
    cssFilter: "brightness(1.06) sepia(0.18) saturate(1.08) contrast(1.02)",
  },
  {
    id: "ulzzang",
    name: "Hàn Quốc Ulzzang",
    badge: "Korea",
    color: "from-purple-400 to-pink-600",
    cssFilter: "brightness(1.12) contrast(0.98) saturate(1.05)",
  },
  {
    id: "kodak",
    name: "Film Kodak Gold",
    badge: "Retro",
    color: "from-yellow-500 to-amber-700",
    cssFilter: "brightness(1.04) contrast(1.1) sepia(0.25) saturate(1.2)",
  },
  {
    id: "tokyo",
    name: "Tokyo Lạnh",
    badge: "Cool",
    color: "from-blue-500 to-indigo-700",
    cssFilter: "brightness(1.05) contrast(1.08) saturate(0.9) hue-rotate(-8deg)",
  },
  {
    id: "bw",
    name: "Đen Trắng Nghệ Thuật",
    badge: "Mono",
    color: "from-zinc-500 to-zinc-800",
    cssFilter: "grayscale(1) contrast(1.2) brightness(1.05)",
  },
];

const FRAME_PRESETS: FramePreset[] = [
  { id: "none", name: "Không khung", badge: "FULL", borderColor: "border-slate-700 bg-slate-900/60" },
  { id: "polaroid-white", name: "Polaroid Trắng", badge: "CLASSIC", borderColor: "border-slate-500 bg-slate-800/80" },
  { id: "polaroid-sakura", name: "Polaroid Sakura", badge: "CUTE", borderColor: "border-pink-500 bg-pink-950/50" },
  { id: "instax-sky", name: "Instax Bầu Trời", badge: "FRESH", borderColor: "border-cyan-500 bg-cyan-950/50" },
  { id: "diem10-vip", name: "Vinh Danh Điểm 10+", badge: "VIP", borderColor: "border-blue-500 bg-blue-950/50" },
  { id: "y2k-window", name: "Cửa Sổ Y2K", badge: "TREND", borderColor: "border-purple-500 bg-purple-950/50" },
  { id: "kodak-film", name: "Cuộn Phim Retro", badge: "KODAK", borderColor: "border-amber-500 bg-amber-950/50" },
  { id: "vogue-mag", name: "Bìa Tạp Chí", badge: "VOGUE", borderColor: "border-rose-500 bg-rose-950/50" },
  { id: "cinema-219", name: "Phim Điện Ảnh", badge: "21:9", borderColor: "border-zinc-500 bg-zinc-950/80" },
  { id: "cam-rec", name: "Máy Quay REC", badge: "CAM", borderColor: "border-red-500 bg-red-950/40" },
  { id: "neon-tiktok", name: "Neon TikTok", badge: "GLOW", borderColor: "border-indigo-500 bg-indigo-950/50" },
  { id: "royal-gold", name: "Khung Hoàng Gia", badge: "LUXURY", borderColor: "border-yellow-500 bg-yellow-950/40" },
];

const STICKER_LIST = [
  "💖", "✨", "👑", "🐰", "🔥", "💯", "🌸", "🎀",
  "🎓", "🏆", "⭐", "🍀", "🦋", "🍓", "🎉", "😎",
];

export default function CameraStudioPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // State hiển thị & điều khiển
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeTab, setActiveTab] = useState<"frames" | "beauty" | "makeup" | "filters" | "downloads">("frames");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "4:3" | "1:1" | "9:16">("16:9");
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const [previewModalItem, setPreviewModalItem] = useState<MediaItem | null>(null);

  // State & Ref cho tính năng ZOOM (0.5x -> 3.0x)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const zoomRef = useRef<number>(1.0);

  // State Khung, Sticker, Chữ
  const [selectedFrame, setSelectedFrame] = useState<string>("polaroid-sakura");
  const [customCaption, setCustomCaption] = useState<string>("Điểm 10+ Studio ✨");
  const [showDateStamp, setShowDateStamp] = useState<boolean>(true);
  const [stickers, setStickers] = useState<StickerItem[]>([
    { id: "init-1", emoji: "✨", x: 0.88, y: 0.18, scale: 1.2 },
  ]);
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);

  // State Làm đẹp & Makeup & Bộ lọc
  const [filterPreset, setFilterPreset] = useState<FilterPreset>(WUTA_FILTERS[1]);
  const [skinSmooth, setSkinSmooth] = useState<number>(45);
  const [skinWhiten, setSkinWhiten] = useState<number>(35);
  const [rosyCheeks, setRosyCheeks] = useState<number>(25);
  const [lipTint, setLipTint] = useState<number>(30);
  const [sharpness, setSharpness] = useState<number>(20);

  // Danh sách ảnh/video đã chụp
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // Ref đồng bộ vào vòng lặp renderLoop để tránh lỗi Stale Closure
  const stateRef = useRef({
    aspectRatio,
    isMirrored,
    isComparing,
    selectedFrame,
    customCaption,
    showDateStamp,
    stickers,
    filterPreset,
    skinSmooth,
    skinWhiten,
    rosyCheeks,
    lipTint,
    sharpness,
  });

  useEffect(() => {
    stateRef.current = {
      aspectRatio,
      isMirrored,
      isComparing,
      selectedFrame,
      customCaption,
      showDateStamp,
      stickers,
      filterPreset,
      skinSmooth,
      skinWhiten,
      rosyCheeks,
      lipTint,
      sharpness,
    };
  }, [
    aspectRatio,
    isMirrored,
    isComparing,
    selectedFrame,
    customCaption,
    showDateStamp,
    stickers,
    filterPreset,
    skinSmooth,
    skinWhiten,
    rosyCheeks,
    lipTint,
    sharpness,
  ]);

  // Hàm thay đổi mức Zoom an toàn
  const updateZoom = useCallback((newZoom: number) => {
    const clamped = Math.min(3.0, Math.max(0.5, Number(newZoom.toFixed(1))));
    setZoomLevel(clamped);
    zoomRef.current = clamped;

    // Nếu trình duyệt/thiết bị có hỗ trợ phần cứng zoom camera thì áp dụng thêm
    try {
      const stream = streamRef.current;
      if (stream) {
        const [track] = stream.getVideoTracks();
        if (track && typeof track.getCapabilities === "function") {
          const capabilities = track.getCapabilities() as any;
          if (capabilities && "zoom" in capabilities && clamped >= 1) {
            const minZ = capabilities.zoom.min || 1;
            const maxZ = capabilities.zoom.max || 3;
            const hwZoom = Math.min(maxZ, Math.max(minZ, clamped));
            track.applyConstraints({ advanced: [{ zoom: hwZoom }] as any }).catch(() => {});
          }
        }
      }
    } catch {
      // Bỏ qua nếu thiết bị không hỗ trợ zoom phần cứng
    }
  }, []);

  // Tự động tối ưu tỷ lệ khung hình & mức zoom vừa vặn khi mở trên điện thoại
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setAspectRatio("4:3");
      updateZoom(0.7); // Mặc định thu nhỏ góc nhìn trên điện thoại để không bị sát mặt
    }
  }, [updateZoom]);

  // Khởi tạo Camera
  const initCamera = useCallback(async (mode: "user" | "environment") => {
    setStatus("loading");
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch (err) {
      console.error("Camera error:", err);
      try {
        // Fallback nếu không có quyền micro
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
        streamRef.current = videoOnlyStream;
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnlyStream;
          await videoRef.current.play();
        }
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    initCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, initCamera]);

  // Bộ đếm thời gian quay video
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // Vòng lặp vẽ hình ảnh lên Canvas (Render Loop)
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const {
            aspectRatio: curAspect,
            isMirrored: curMirror,
            isComparing: curCompare,
            selectedFrame: curFrame,
            customCaption: curCaption,
            showDateStamp: curDate,
            stickers: curStickers,
            filterPreset: curFilter,
            skinSmooth: curSmooth,
            skinWhiten: curWhiten,
            rosyCheeks: curRosy,
            lipTint: curLip,
          } = stateRef.current;

          // Xác định kích thước Canvas mục tiêu theo tỷ lệ
          let targetW = 1280;
          let targetH = 720;
          if (curAspect === "4:3") {
            targetW = 960;
            targetH = 720;
          } else if (curAspect === "1:1") {
            targetW = 720;
            targetH = 720;
          } else if (curAspect === "9:16") {
            targetW = 720;
            targetH = 1280;
          }

          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          const vWidth = video.videoWidth || 640;
          const vHeight = video.videoHeight || 480;
          const videoAspect = vWidth / vHeight;
          const targetAspect = targetW / targetH;

          // Tính vùng cắt chuẩn ban đầu (khi zoom = 1.0)
          let sw = vWidth;
          let sh = vHeight;
          let sx = 0;
          let sy = 0;

          if (videoAspect > targetAspect) {
            sw = vHeight * targetAspect;
            sx = (vWidth - sw) / 2;
          } else {
            sh = vWidth / targetAspect;
            sy = (vHeight - sh) / 2;
          }

          // Đọc giá trị zoom từ zoomRef (an toàn 100%, không gây sập vòng lặp)
          const currentZoom = zoomRef.current || 1.0;

          ctx.save();
          ctx.clearRect(0, 0, targetW, targetH);

          // Lật gương nếu bật
          if (curMirror) {
            ctx.translate(targetW, 0);
            ctx.scale(-1, 1);
          }

          // Thiết lập bộ lọc màu & làm đẹp
          const whitenBoost = 1 + (curWhiten / 100) * 0.25;
          const saturateBoost = 1 + (curRosy / 100) * 0.3 + (curLip / 100) * 0.2;
          const baseFilter = curFilter.cssFilter !== "none" ? curFilter.cssFilter : "";
          const activeFilterString = curCompare
            ? "none"
            : `${baseFilter} brightness(${whitenBoost}) saturate(${saturateBoost})`.trim();

          if (currentZoom >= 1.0) {
            // PHÓNG TO (1.0x -> 3.0x): Cắt sâu vào tâm khung hình
            const zSw = sw / currentZoom;
            const zSh = sh / currentZoom;
            const zSx = sx + (sw - zSw) / 2;
            const zSy = sy + (sh - zSh) / 2;

            ctx.filter = activeFilterString;
            ctx.drawImage(video, zSx, zSy, zSw, zSh, 0, 0, targetW, targetH);

            if (!curCompare && curSmooth > 0) {
              ctx.save();
              ctx.globalAlpha = (curSmooth / 100) * 0.32;
              ctx.filter = `blur(${Math.max(1, Math.round((curSmooth / 100) * 8))}px)`;
              ctx.drawImage(video, zSx, zSy, zSw, zSh, 0, 0, targetW, targetH);
              ctx.restore();
            }
          } else {
            // THU NHỎ (0.5x -> 0.9x): Mở rộng tối đa toàn bộ cảm biến camera & thu nhỏ khung hình để không bị sát mặt trên điện thoại
            // 1. Vẽ lớp nền mờ tràn viền thẩm mỹ
            ctx.save();
            ctx.filter = `blur(28px) brightness(0.75)`;
            ctx.drawImage(video, 0, 0, vWidth, vHeight, 0, 0, targetW, targetH);
            ctx.restore();

            // 2. Tính kích thước hiển thị toàn bộ cảm biến camera theo tỷ lệ thật
            const scaleFactor = currentZoom; // 0.5 -> 0.95
            let fitW = targetW;
            let fitH = targetW / videoAspect;
            if (fitH > targetH) {
              fitH = targetH;
              fitW = targetH * videoAspect;
            }

            // Nội suy mượt mà giữa khung phủ đầy và khung thu nhỏ
            const drawW = targetW * scaleFactor + fitW * (1 - scaleFactor);
            const drawH = targetH * scaleFactor + fitH * (1 - scaleFactor);
            const dx = (targetW - drawW) / 2;
            const dy = (targetH - drawH) / 2;

            ctx.filter = activeFilterString;
            ctx.drawImage(video, 0, 0, vWidth, vHeight, dx, dy, drawW, drawH);

            if (!curCompare && curSmooth > 0) {
              ctx.save();
              ctx.globalAlpha = (curSmooth / 100) * 0.32;
              ctx.filter = `blur(${Math.max(1, Math.round((curSmooth / 100) * 8))}px)`;
              ctx.drawImage(video, 0, 0, vWidth, vHeight, dx, dy, drawW, drawH);
              ctx.restore();
            }
          }

          // Phủ lớp tint màu nếu bộ lọc có
          if (!curCompare && curFilter.tintColor && curFilter.blendMode) {
            ctx.save();
            ctx.globalCompositeOperation = curFilter.blendMode;
            ctx.fillStyle = curFilter.tintColor;
            ctx.fillRect(0, 0, targetW, targetH);
            ctx.restore();
          }

          ctx.restore(); // Kết thúc phần lật gương để vẽ Khung & Chữ đúng chiều

          // VẼ KHUNG ẢNH NGHỆ THUẬT (12 MẪU)
          drawArtisticFrame(ctx, targetW, targetH, curFrame, curCaption, curDate);

          // VẼ STICKERS
          curStickers.forEach((st) => {
            ctx.save();
            const fontSize = Math.round(Math.min(targetW, targetH) * 0.08 * st.scale);
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(st.emoji, st.x * targetW, st.y * targetH);
            ctx.restore();
          });
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Hàm vẽ 12 khung ảnh nghệ thuật lên Canvas
  const drawArtisticFrame = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    frameId: string,
    caption: string,
    showDate: boolean
  ) => {
    if (frameId === "none") return;

    ctx.save();
    const dateStr = new Date().toLocaleDateString("vi-VN");
    const pad = Math.round(Math.min(w, h) * 0.04);
    const bottomBar = Math.round(h * 0.13);

    if (frameId === "polaroid-white" || frameId === "polaroid-sakura" || frameId === "instax-sky") {
      const bg =
        frameId === "polaroid-white"
          ? "#ffffff"
          : frameId === "polaroid-sakura"
          ? "#fce7f3"
          : "#e0f2fe";
      const textCol =
        frameId === "polaroid-white"
          ? "#1e293b"
          : frameId === "polaroid-sakura"
          ? "#be185d"
          : "#0369a1";

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, pad);
      ctx.fillRect(0, 0, pad, h);
      ctx.fillRect(w - pad, 0, pad, h);
      ctx.fillRect(0, h - bottomBar, w, bottomBar);

      ctx.fillStyle = textCol;
      ctx.font = `bold ${Math.round(bottomBar * 0.34)}px sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(caption || "Điểm 10+ Studio ✨", pad * 1.5, h - bottomBar / 2);

      if (showDate) {
        ctx.font = `600 ${Math.round(bottomBar * 0.26)}px monospace`;
        ctx.textAlign = "right";
        ctx.fillText(dateStr, w - pad * 1.5, h - bottomBar / 2);
      }
    } else if (frameId === "diem10-vip") {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = pad * 0.7;
      ctx.strokeRect(pad / 2, pad / 2, w - pad, h - pad);

      ctx.fillStyle = "rgba(0, 77, 149, 0.88)";
      ctx.fillRect(0, h - bottomBar, w, bottomBar);

      ctx.fillStyle = "#fde047";
      ctx.font = `bold ${Math.round(bottomBar * 0.35)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `🏆 ${caption || "VINH DANH HỌC SINH ĐIỂM 10+"} ${showDate ? `• ${dateStr}` : ""}`,
        w / 2,
        h - bottomBar / 2
      );
    } else if (frameId === "y2k-window") {
      const topBar = Math.round(h * 0.08);
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(0, 0, w, topBar);
      ctx.strokeStyle = "#e9d5ff";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(topBar * 0.45)}px monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`★ Y2K_CAMERA.EXE - ${caption}`, 20, topBar / 2);
    } else if (frameId === "kodak-film") {
      const sideH = Math.round(h * 0.09);
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, w, sideH);
      ctx.fillRect(0, h - sideH, w, sideH);

      ctx.fillStyle = "#f59e0b";
      ctx.font = `bold ${Math.round(sideH * 0.38)}px monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`KODAK GOLD 200 • ${caption}`, 24, h - sideH / 2);
      if (showDate) {
        ctx.textAlign = "right";
        ctx.fillText(dateStr, w - 24, h - sideH / 2);
      }
    } else if (frameId === "vogue-mag") {
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `bold ${Math.round(h * 0.09)}px serif`;
      ctx.textAlign = "center";
      ctx.fillText("VOGUE", w / 2, Math.round(h * 0.12));

      ctx.font = `600 ${Math.round(h * 0.032)}px sans-serif`;
      ctx.fillText(caption, w / 2, h - 36);
    } else if (frameId === "cinema-219") {
      const barH = Math.round(h * 0.12);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, barH);
      ctx.fillRect(0, h - barH, w, barH);

      ctx.fillStyle = "#fef08a";
      ctx.font = `italic ${Math.round(barH * 0.36)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`"${caption}"`, w / 2, h - barH / 2);
    } else if (frameId === "cam-rec") {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      const cLen = 40;
      // 4 góc ngắm
      ctx.beginPath();
      ctx.moveTo(24, 24 + cLen);
      ctx.lineTo(24, 24);
      ctx.lineTo(24 + cLen, 24);
      ctx.moveTo(w - 24 - cLen, 24);
      ctx.lineTo(w - 24, 24);
      ctx.lineTo(w - 24, 24 + cLen);
      ctx.moveTo(24, h - 24 - cLen);
      ctx.lineTo(24, h - 24);
      ctx.lineTo(24 + cLen, h - 24);
      ctx.moveTo(w - 24 - cLen, h - 24);
      ctx.lineTo(w - 24, h - 24);
      ctx.lineTo(w - 24, h - 24 - cLen);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = `bold ${Math.round(h * 0.035)}px monospace`;
      ctx.fillText("● REC", 42, 58);

      if (showDate) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${caption} | ${dateStr}`, 42, h - 42);
      }
    } else if (frameId === "neon-tiktok") {
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(h * 0.038)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(caption, w / 2, h - 34);
    } else if (frameId === "royal-gold") {
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 14;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      ctx.fillStyle = "rgba(234, 179, 8, 0.9)";
      ctx.font = `bold ${Math.round(h * 0.038)}px serif`;
      ctx.textAlign = "center";
      ctx.fillText(`♛ ${caption} ♛`, w / 2, h - 34);
    }

    ctx.restore();
  };

  // Chụp ảnh
  const handleTakePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 180);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: "photo",
      url: dataUrl,
      timestamp: new Date().toLocaleTimeString("vi-VN"),
      filterName: filterPreset.name,
    };

    setMediaList((prev) => [newItem, ...prev]);
    setActiveTab("downloads");
  };

  // Quay / Dừng quay Video
  const handleToggleRecord = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      recordedChunksRef.current = [];
      const canvasStream = canvas.captureStream(30);

      if (streamRef.current) {
        const audioTracks = streamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: "video",
          url: videoUrl,
          timestamp: new Date().toLocaleTimeString("vi-VN"),
          filterName: filterPreset.name,
        };
        setMediaList((prev) => [newItem, ...prev]);
        setActiveTab("downloads");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    }
  };

  // Hàm chuyển DataURL sang File đồng bộ (Synchronous) để giữ nguyên User Gesture trên iPhone Safari
  const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    try {
      const arr = dataurl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch {
      return null;
    }
  };

  // Hàm xử lý Tải về máy tối ưu riêng cho iPhone 14 Pro Max & Laptop
  const handleDownloadItem = async (item: MediaItem) => {
    const fileName = `diem10-studio-${item.id}.${item.type === "photo" ? "jpg" : "webm"}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 1. TRÊN ĐIỆN THOẠI (iPhone / Android): Kích hoạt bảng Share/Lưu ảnh gốc của iOS không bị chặn
    if (isMobile && item.type === "photo") {
      try {
        const file = dataURLtoFile(item.url, fileName);
        if (
          file &&
          navigator.share &&
          (!navigator.canShare || navigator.canShare({ files: [file] }))
        ) {
          await navigator.share({
            files: [file],
            title: "Ảnh chụp từ Điểm 10+ Studio",
          });
          return;
        }
      } catch (err: any) {
        // Nếu người dùng tự đóng bảng share thì dừng lại
        if (err && err.name === "AbortError") return;
      }

      // Nếu trình duyệt ẩn danh hoặc in-app browser chặn Share API, mở hộp thoại xem ảnh để nhấn giữ "Lưu vào Ảnh"
      setPreviewModalItem(item);
      return;
    }

    // 2. TRÊN LAPTOP / PC: Tải thẳng tệp về thư mục Downloads ngay lập tức
    const a = document.createElement("a");
    a.href = item.url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Thêm & kéo thả Sticker trên màn hình
  const addSticker = (emoji: string) => {
    const newSt: StickerItem = {
      id: `st-${Date.now()}`,
      emoji,
      x: 0.3 + Math.random() * 0.4,
      y: 0.25 + Math.random() * 0.4,
      scale: 1.2,
    };
    setStickers((prev) => [...prev, newSt]);
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const st = stickers[i];
      const dist = Math.hypot(st.x - clickX, st.y - clickY);
      if (dist < 0.08) {
        setDraggingStickerId(st.id);
        return;
      }
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingStickerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const moveX = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width));
    const moveY = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height));

    setStickers((prev) =>
      prev.map((st) => (st.id === draggingStickerId ? { ...st, x: moveX, y: moveY } : st))
    );
  };

  const handleCanvasPointerUp = () => {
    setDraggingStickerId(null);
  };

  // Nút Auto-Beauty 1 chạm
  const applyMagicBeauty = () => {
    setSkinSmooth(65);
    setSkinWhiten(50);
    setRosyCheeks(40);
    setLipTint(45);
    setFilterPreset(WUTA_FILTERS[1]);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-3 md:p-6">
      {/* Thanh điều hướng phía trên */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl">
        <Link
          href="/apps-new"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Kho Ứng Dụng</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-bold px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wuta & B612 AI Camera Studio • 12 Khung Nghệ Thuật</span>
        </div>
      </div>

      {/* Bố cục chính */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI: MÀN HÌNH NGẮM CAMERA (7 cột) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center min-h-[380px] md:min-h-[500px]">
            {/* Video gốc ẩn */}
            <video ref={videoRef} playsInline muted className="hidden" />

            {/* Hiệu ứng chớp đèn Flash */}
            {flashEffect && (
              <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity" />
            )}

            {/* Nhãn Bộ lọc góc trên bên trái */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
              <div className="bg-black/65 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-pink-200">
                  {filterPreset.name}
                </span>
              </div>

              {/* CỤM NÚT ZOOM (+ / -) PHÓNG TO & THU NHỎ CHỐNG SÁT MẶT */}
              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-full border border-pink-500/40 shadow-lg">
                <button
                  type="button"
                  onClick={() => updateZoom(zoomLevel - 0.1)}
                  className="w-7 h-7 flex items-center justify-center text-white font-extrabold hover:bg-pink-500/30 active:scale-90 rounded-full transition cursor-pointer"
                  title="Thu nhỏ (Lùi xa mặt)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateZoom(1.0)}
                  className="text-[11px] font-extrabold text-pink-400 px-1.5 min-w-[40px] text-center hover:text-white transition cursor-pointer"
                  title="Bấm để về 1.0x"
                >
                  {zoomLevel.toFixed(1)}x
                </button>
                <button
                  type="button"
                  onClick={() => updateZoom(zoomLevel + 0.1)}
                  className="w-7 h-7 flex items-center justify-center text-white font-extrabold hover:bg-pink-500/30 active:scale-90 rounded-full transition cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cụm chọn tỷ lệ khung hình góc trên bên phải */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/65 backdrop-blur-md p-1 rounded-full border border-white/15">
              {(["16:9", "4:3", "1:1", "9:16"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    aspectRatio === ratio
                      ? "bg-pink-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Nút chọn nhanh mức Zoom (0.6x Góc rộng cho Điện thoại / 1x / 1.5x / 2x) */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              {[
                { label: "0.6x Rộng", val: 0.6 },
                { label: "0.8x Vừa", val: 0.8 },
                { label: "1.0x Chuẩn", val: 1.0 },
                { label: "1.5x Gần", val: 1.5 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => updateZoom(preset.val)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    Math.abs(zoomLevel - preset.val) < 0.05
                      ? "bg-pink-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Canvas hiển thị hình ảnh thời gian thực */}
            <canvas
              ref={canvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              className="w-full h-auto max-h-[540px] object-contain touch-none select-none"
            />

            {status === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-30 gap-2">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-pink-300">Đang khởi động AI Camera...</p>
              </div>
            )}

            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-30 p-6 text-center gap-3">
                <p className="text-sm font-bold text-rose-400">
                  Không thể truy cập Camera. Vui lòng cấp quyền Camera trên trình duyệt.
                </p>
                <button
                  type="button"
                  onClick={() => initCamera(facingMode)}
                  className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Thanh điều khiển chụp / quay dưới đáy màn hình camera */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between bg-slate-900/75 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-3xl max-w-lg mx-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition cursor-pointer ${
                    isMirrored
                      ? "bg-slate-800 border-pink-500/40 text-pink-300"
                      : "bg-slate-800/60 border-white/10 text-slate-300"
                  }`}
                  title="Lật gương trái/phải"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={applyMagicBeauty}
                  className="w-10 h-10 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 flex items-center justify-center hover:bg-pink-900/70 transition cursor-pointer"
                  title="Làm đẹp tự động AI"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>

              {/* Cụm nút Chụp ảnh & Quay Video */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 border-4 border-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
                  title="Chụp ảnh"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition cursor-pointer ${
                    isRecording ? "bg-red-600 animate-pulse" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                  title={isRecording ? "Dừng quay" : "Quay video"}
                >
                  {isRecording ? (
                    <Square className="w-4 h-4 text-white fill-white" />
                  ) : (
                    <Video className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Nút đổi Camera trước/sau & Giữ để so sánh cam gốc */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
                  }
                  className="w-10 h-10 rounded-full bg-slate-800/70 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Đổi camera trước/sau"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onPointerDown={() => setIsComparing(true)}
                  onPointerUp={() => setIsComparing(false)}
                  onPointerLeave={() => setIsComparing(false)}
                  className="w-10 h-10 rounded-full bg-slate-800/70 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Nhấn giữ để xem Cam gốc"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Thanh chọn nhanh khung ảnh ngay dưới camera */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-pink-400 shrink-0 px-2">
              # Khung nhanh:
            </span>
            {FRAME_PRESETS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFrame(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedFrame === f.id
                    ? "bg-pink-600 text-white shadow"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG CÔNG CỤ TÙY CHỈNH & TẢI XUỐNG (5 cột) */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-2xl">
          {/* Thanh Tabs */}
          <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("frames")}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "frames"
                  ? "bg-pink-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Khung & Sticker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("beauty")}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "beauty"
                  ? "bg-pink-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Làm đẹp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("makeup")}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "makeup"
                  ? "bg-pink-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Makeup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("filters")}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "filters"
                  ? "bg-pink-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Bộ lọc
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("downloads")}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "downloads"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-400 hover:bg-emerald-950/50"
              }`}
            >
              Tải xuống ({mediaList.length})
            </button>
          </div>

          {/* NỘI DUNG TAB 1: KHUNG & STICKER */}
          {activeTab === "frames" && (
            <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">
                  # CHỌN KHUNG ẢNH ĐẸP (12 MẪU)
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDateStamp}
                    onChange={(e) => setShowDateStamp(e.target.checked)}
                    className="accent-pink-500 rounded"
                  />
                  <span>In ngày chụp</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {FRAME_PRESETS.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      frame.borderColor
                    } ${
                      selectedFrame === frame.id
                        ? "ring-2 ring-pink-400 scale-[1.02]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="inline-block w-fit text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/40 text-pink-300">
                      {frame.badge}
                    </span>
                    <span className="text-xs font-bold text-white leading-tight">
                      {frame.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dòng chữ kỷ niệm */}
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2">
                <label className="text-xs font-bold text-pink-300">
                  T Dòng chữ kỷ niệm trên khung ảnh:
                </label>
                <input
                  type="text"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Nhập chữ kỷ niệm..."
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Stickers */}
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-pink-400">
                    STICKERS (BẤM ĐỂ THÊM & KÉO THẢ TRÊN MÀN HÌNH)
                  </span>
                  {stickers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setStickers([])}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa hết
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {STICKER_LIST.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => addSticker(em)}
                      className="h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-lg transition active:scale-90 cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 2: LÀM ĐẸP */}
          {activeTab === "beauty" && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Mịn da AI (Skin Smooth)</span>
                  <span className="text-pink-400">{skinSmooth}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skinSmooth}
                  onChange={(e) => setSkinSmooth(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Trắng sáng hồng hào (Whiten)</span>
                  <span className="text-pink-400">{skinWhiten}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skinWhiten}
                  onChange={(e) => setSkinWhiten(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Thu phóng khung mặt (Zoom View)</span>
                  <span className="text-pink-400">{zoomLevel.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={zoomLevel}
                  onChange={(e) => updateZoom(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 3: MAKEUP */}
          {activeTab === "makeup" && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Má hồng tự nhiên (Blush)</span>
                  <span className="text-pink-400">{rosyCheeks}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rosyCheeks}
                  onChange={(e) => setRosyCheeks(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Tươi màu môi (Lip Tint)</span>
                  <span className="text-pink-400">{lipTint}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={lipTint}
                  onChange={(e) => setLipTint(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 4: BỘ LỌC MÀU */}
          {activeTab === "filters" && (
            <div className="grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {WUTA_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterPreset(f)}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${f.color} text-left transition flex flex-col justify-between h-20 cursor-pointer ${
                    filterPreset.id === f.id
                      ? "ring-2 ring-white scale-[1.02]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase bg-black/30 px-2 py-0.5 rounded-full w-fit">
                    {f.badge}
                  </span>
                  <span className="text-xs font-extrabold text-white">{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* NỘI DUNG TAB 5: TẢI XUỐNG */}
          {activeTab === "downloads" && (
            <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {mediaList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chưa có ảnh hoặc video nào. Hãy bấm nút chụp ảnh màu hồng để lưu khoảnh khắc nhé!
                </div>
              ) : (
                mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === "photo" ? (
                        <img
                          src={item.url}
                          alt="Captured"
                          onClick={() => setPreviewModalItem(item)}
                          className="w-16 h-12 object-cover rounded-xl border border-slate-700 cursor-pointer"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-16 h-12 object-cover rounded-xl border border-slate-700"
                        />
                      )}
                      <div>
                        <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/30">
                          {item.filterName}
                        </span>
                        <p className="text-xs text-slate-300 mt-1 font-semibold">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadItem(item)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải về máy</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hộp thoại xem và nhấn giữ lưu ảnh dự phòng trên iPhone */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-4 flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400">
                📱 Trên iPhone: Nhấn giữ vào ảnh chọn &quot;Lưu vào Ảnh&quot;
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewModalItem.url}
              alt="Preview"
              className="w-full h-auto max-h-[65vh] object-contain rounded-2xl border border-slate-800"
            />
            <button
              type="button"
              onClick={() => setPreviewModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}