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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeTab, setActiveTab] = useState<"beauty" | "makeup" | "filters" | "creative" | "gallery">("creative");

  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioItem>(DEFAULT_AR);
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1.0 là mặc định, >1 là phóng to, <1 (nếu hỗ trợ) hoặc căn chỉnh khung
  const [skinSmooth, setSkinSmooth] = useState<number>(65);
  const [skinWhiten, setSkinWhiten] = useState<number>(40);
  const [rosyCheeks, setRosyCheeks] = useState<number>(30);
  const [slimFace, setSlimFace] = useState<number>(50);
  const [bigEyes, setBigEyes] = useState<number>(50);
  const [lipTint, setLipTint] = useState<number>(20);

  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(DEFAULT_FILTER);
  const [selectedFrame, setSelectedFrame] = useState<string>("polaroid_pink");
  const [frameCaption, setFrameCaption] = useState<string>("Điểm 10+ Studio ✨");
  const [showDateStamp, setShowDateStamp] = useState<boolean>(true);
  const [vignetteVal, setVignetteVal] = useState<number>(20);

  const [stickers, setStickers] = useState<StickerItem[]>([
    { id: "default-1", emoji: "✨", x: 82, y: 18, scale: 1.4 },
  ]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  const initCamera = useCallback(async () => {
    setStatus("loading");
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    initCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initCamera]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      timer = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  useEffect(() => {
    let isMounted = true;
    const renderLoop = () => {
      if (!isMounted) return;
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;
      const currentAr = aspectRatio || DEFAULT_AR;

      if (video && canvas && video.readyState >= 2) {
        const targetW = currentAr.w;
        const targetH = currentAr.h;

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const vw = video.videoWidth || 1280;
          const vh = video.videoHeight || 720;
          const videoAspect = vw / vh;
          const targetAspect = targetW / targetH;

          let sx = 0,
            sy = 0,
            sw = vw,
            sh = vh;
          if (videoAspect > targetAspect) {
            sw = vh * targetAspect;
            sx = (vw - sw) / 2;
          } else {
            sh = vw / targetAspect;
            sy = (vh - sh) / 2;
          }

          ctx.save();
          ctx.clearRect(0, 0, targetW, targetH);

          if (isMirrored) {
            ctx.translate(targetW, 0);
            ctx.scale(-1, 1);
          }

          const filterPreset = selectedFilter || DEFAULT_FILTER;

          // Tính toán lại khung cắt (crop) từ tâm theo hệ số zoom
const zSw = sw / zoom;
const zSh = sh / zoom;
const zSx = sx + (sw - zSw) / 2;
const zSy = sy + (sh - zSh) / 2;

          if (isComparing) {
            ctx.filter = "none";
            ctx.drawImage(video, zSx, zSy, zSw, zSh, 0, 0, targetW, targetH);
          } else {
            const whitenBoost = 1 + (skinWhiten / 100) * 0.25;
            const saturateBoost = 1 + (rosyCheeks / 100) * 0.3 + (lipTint / 100) * 0.2;
            const baseFilter = filterPreset.cssFilter !== "none" ? filterPreset.cssFilter : "";

            ctx.filter = `${baseFilter} brightness(${whitenBoost}) saturate(${saturateBoost})`.trim();
            ctx.drawImage(video, zSx, zSy, zSw, zSh, 0, 0, targetW, targetH);

            if (skinSmooth > 0) {
              ctx.save();
              ctx.globalAlpha = (skinSmooth / 100) * 0.3;
              ctx.filter = `blur(${Math.max(1, Math.round((skinSmooth / 100) * 8))}px)`;
              ctx.drawImage(video, zSx, zSy, zSw, zSh, 0, 0, targetW, targetH);
              ctx.restore();
            }

            if (filterPreset.tintColor && filterPreset.blendMode) {
              ctx.save();
              ctx.fillStyle = filterPreset.tintColor;
              ctx.globalCompositeOperation = filterPreset.blendMode;
              ctx.fillRect(0, 0, targetW, targetH);
              ctx.restore();
            }

            if (lipTint > 0) {
              ctx.save();
              const makeUpGrad = ctx.createLinearGradient(0, targetH / 2, 0, targetH);
              makeUpGrad.addColorStop(0, "rgba(225, 29, 72, 0)");
              makeUpGrad.addColorStop(1, `rgba(225, 29, 72, ${(lipTint / 100) * 0.15})`);
              ctx.fillStyle = makeUpGrad;
              ctx.globalCompositeOperation = "soft-light";
              ctx.fillRect(0, 0, targetW, targetH);
              ctx.restore();
            }

            if (vignetteVal > 0) {
              ctx.save();
              const grad = ctx.createRadialGradient(
                targetW / 2,
                targetH / 2,
                targetW * 0.3,
                targetW / 2,
                targetH / 2,
                targetW * 0.8
              );
              grad.addColorStop(0, "rgba(0,0,0,0)");
              grad.addColorStop(1, `rgba(0,0,0,${(vignetteVal / 100) * 0.8})`);
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, targetW, targetH);
              ctx.restore();
            }
          }

          ctx.restore();

          // --- VẼ 12 KHUNG ẢNH NGHỆ THUẬT ---
          const nowStr = new Date().toLocaleDateString("vi-VN");
          const captionText = frameCaption.trim() || "Điểm 10+ Studio";

          ctx.save();

          if (selectedFrame === "polaroid") {
            const side = Math.round(targetW * 0.035);
            const bottom = Math.round(targetH * 0.14);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, targetW, side);
            ctx.fillRect(0, 0, side, targetH);
            ctx.fillRect(targetW - side, 0, side, targetH);
            ctx.fillRect(0, targetH - bottom, targetW, bottom);

            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 26px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(captionText, targetW / 2, targetH - bottom / 2 + 6);

            if (showDateStamp) {
              ctx.fillStyle = "#64748b";
              ctx.font = "600 18px sans-serif";
              ctx.textAlign = "right";
              ctx.fillText(nowStr, targetW - side - 16, targetH - 22);
            }
          } else if (selectedFrame === "polaroid_pink") {
            const side = Math.round(targetW * 0.035);
            const bottom = Math.round(targetH * 0.14);
            const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
            grad.addColorStop(0, "#fce7f3");
            grad.addColorStop(0.5, "#fbcfe8");
            grad.addColorStop(1, "#f9a8d4");

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetW, side);
            ctx.fillRect(0, 0, side, targetH);
            ctx.fillRect(targetW - side, 0, side, targetH);
            ctx.fillRect(0, targetH - bottom, targetW, bottom);

            ctx.strokeStyle = "#f472b6";
            ctx.lineWidth = 3;
            ctx.strokeRect(side, side, targetW - side * 2, targetH - side - bottom);

            ctx.fillStyle = "#be185d";
            ctx.font = "bold 26px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`🌸 ${captionText} 🌸`, targetW / 2, targetH - bottom / 2 + 6);

            if (showDateStamp) {
              ctx.fillStyle = "#db2777";
              ctx.font = "bold 18px sans-serif";
              ctx.textAlign = "right";
              ctx.fillText(nowStr, targetW - side - 18, targetH - 22);
            }
          } else if (selectedFrame === "instax_sky") {
            const side = Math.round(targetW * 0.035);
            const bottom = Math.round(targetH * 0.14);
            const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
            grad.addColorStop(0, "#e0f2fe");
            grad.addColorStop(1, "#bae6fd");

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetW, side);
            ctx.fillRect(0, 0, side, targetH);
            ctx.fillRect(targetW - side, 0, side, targetH);
            ctx.fillRect(0, targetH - bottom, targetW, bottom);

            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 3;
            ctx.strokeRect(side, side, targetW - side * 2, targetH - side - bottom);

            ctx.fillStyle = "#0369a1";
            ctx.font = "bold 26px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`☁️ ${captionText} ☁️`, targetW / 2, targetH - bottom / 2 + 6);

            if (showDateStamp) {
              ctx.fillStyle = "#0284c7";
              ctx.font = "bold 18px sans-serif";
              ctx.textAlign = "right";
              ctx.fillText(nowStr, targetW - side - 18, targetH - 22);
            }
          } else if (selectedFrame === "diem10_gold") {
            const border = 26;
            ctx.fillStyle = "#004D95";
            ctx.fillRect(0, 0, targetW, border);
            ctx.fillRect(0, targetH - 68, targetW, 68);
            ctx.fillRect(0, 0, border, targetH);
            ctx.fillRect(targetW - border, 0, border, targetH);

            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 5;
            ctx.strokeRect(border, border, targetW - border * 2, targetH - border - 68);

            ctx.fillStyle = "#fbbf24";
            ctx.font = "900 24px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`⭐ ${captionText.toUpperCase()} ⭐`, targetW / 2, targetH - 26);

            if (showDateStamp) {
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 16px sans-serif";
              ctx.textAlign = "right";
              ctx.fillText(nowStr, targetW - border - 14, targetH - 26);
            }
          } else if (selectedFrame === "y2k_window") {
            const topBar = 52;
            const side = 16;
            const grad = ctx.createLinearGradient(0, 0, targetW, 0);
            grad.addColorStop(0, "#ec4899");
            grad.addColorStop(0.5, "#a855f7");
            grad.addColorStop(1, "#3b82f6");

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetW, topBar);
            ctx.fillRect(0, 0, side, targetH);
            ctx.fillRect(targetW - side, 0, side, targetH);
            ctx.fillRect(0, targetH - side, targetW, side);

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.strokeRect(side, topBar, targetW - side * 2, targetH - topBar - side);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`♡ CUTE_CAM.EXE — ${captionText}`, 24, 33);

            ["#fde047", "#4ade80", "#f43f5e"].forEach((col, idx) => {
              ctx.fillStyle = col;
              ctx.beginPath();
              ctx.arc(targetW - 32 - idx * 28, 26, 9, 0, Math.PI * 2);
              ctx.fill();
            });
          } else if (selectedFrame === "film_strip") {
            const barH = Math.round(targetH * 0.11);
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, targetW, barH);
            ctx.fillRect(0, targetH - barH, targetW, barH);

            ctx.fillStyle = "#ffffff";
            const holeW = 24;
            const holeH = Math.round(barH * 0.45);
            for (let x = 28; x < targetW - 28; x += 52) {
              ctx.fillRect(x, Math.round((barH - holeH) / 2), holeW, holeH);
              ctx.fillRect(x, targetH - barH + Math.round((barH - holeH) / 2), holeW, holeH);
            }

            ctx.fillStyle = "#f59e0b";
            ctx.font = "bold 16px monospace";
            ctx.textAlign = "left";
            ctx.fillText("KODAK PORTRA 400 • FILM STUDIO", 30, barH - 6);

            if (showDateStamp) {
              ctx.fillStyle = "#fb923c";
              ctx.font = "bold 26px monospace";
              ctx.textAlign = "right";
              ctx.fillText(`'26 ${nowStr} • ${captionText}`, targetW - 36, targetH - barH - 20);
            }
          } else if (selectedFrame === "magazine") {
            ctx.strokeStyle = "rgba(255,255,255,0.85)";
            ctx.lineWidth = 4;
            ctx.strokeRect(24, 24, targetW - 48, targetH - 48);

            ctx.fillStyle = "rgba(255,255,255,0.92)";
            ctx.font = "900 68px serif";
            ctx.textAlign = "center";
            ctx.fillText("STUDIO 10+", targetW / 2, 96);

            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#f43f5e";
            ctx.fillText(captionText.toUpperCase(), targetW / 2, targetH - 44);

            if (showDateStamp) {
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 16px monospace";
              ctx.textAlign = "left";
              ctx.fillText(`ISSUE • ${nowStr}`, 42, targetH - 44);
            }
          } else if (selectedFrame === "cinema") {
            const barH = Math.round(targetH * 0.12);
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, targetW, barH);
            ctx.fillRect(0, targetH - barH, targetW, barH);

            ctx.fillStyle = "#fde047";
            ctx.font = "italic bold 22px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`"${captionText}"`, targetW / 2, targetH - barH / 2 + 8);
          } else if (selectedFrame === "neon") {
            ctx.strokeStyle = "#ec4899";
            ctx.lineWidth = 8;
            ctx.shadowColor = "#ec4899";
            ctx.shadowBlur = 22;
            ctx.strokeRect(20, 20, targetW - 40, targetH - 40);

            ctx.strokeStyle = "#22d3ee";
            ctx.lineWidth = 4;
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 16;
            ctx.strokeRect(32, 32, targetW - 64, targetH - 64);
            ctx.shadowBlur = 0;

            if (showDateStamp) {
              ctx.fillStyle = "#f472b6";
              ctx.font = "bold 20px monospace";
              ctx.textAlign = "right";
              ctx.fillText(`${captionText} • ${nowStr}`, targetW - 48, targetH - 48);
            }
          } else if (selectedFrame === "vintage_gold") {
            ctx.strokeStyle = "#eab308";
            ctx.lineWidth = 10;
            ctx.strokeRect(18, 18, targetW - 36, targetH - 36);

            ctx.strokeStyle = "#fef08a";
            ctx.lineWidth = 3;
            ctx.strokeRect(32, 32, targetW - 64, targetH - 64);

            ctx.fillStyle = "#fef08a";
            ctx.font = "bold 22px serif";
            ctx.textAlign = "center";
            ctx.fillText(`✦ ${captionText} ✦`, targetW / 2, targetH - 46);
          } else if (selectedFrame === "viewfinder") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.lineWidth = 3;
            const m = 32,
              len = 42;
            ctx.beginPath();
            ctx.moveTo(m, m + len);
            ctx.lineTo(m, m);
            ctx.lineTo(m + len, m);
            ctx.moveTo(targetW - m - len, m);
            ctx.lineTo(targetW - m, m);
            ctx.lineTo(targetW - m, m + len);
            ctx.moveTo(m, targetH - m - len);
            ctx.lineTo(m, targetH - m);
            ctx.lineTo(m + len, targetH - m);
            ctx.moveTo(targetW - m - len, targetH - m);
            ctx.lineTo(targetW - m, targetH - m);
            ctx.lineTo(targetW - m, targetH - m - len);
            ctx.stroke();

            const cx = targetW / 2;
            const cy = targetH / 2;
            ctx.strokeStyle = "rgba(255,255,255,0.45)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy);
            ctx.lineTo(cx + 20, cy);
            ctx.moveTo(cx, cy - 20);
            ctx.lineTo(cx, cy + 20);
            ctx.stroke();

            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(m + 22, m + 24, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 18px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`REC • ${captionText}`, m + 38, m + 30);

            if (showDateStamp) {
              ctx.textAlign = "right";
              ctx.fillText(`4K 60FPS • ${nowStr}`, targetW - m - 16, targetH - m - 14);
            }
          }

          ctx.restore();

          // Stickers
          ctx.save();
          stickers.forEach((st) => {
            const fontSize = Math.round(48 * st.scale);
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const px = (st.x / 100) * targetW;
            const py = (st.y / 100) * targetH;

            if (selectedStickerId === st.id) {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(
                px - fontSize / 1.5,
                py - fontSize / 1.5,
                fontSize * 1.3,
                fontSize * 1.3
              );
              ctx.setLineDash([]);
            }

            ctx.fillText(st.emoji, px, py);
          });
          ctx.restore();
        }
      }
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    aspectRatio,
    isMirrored,
    isComparing,
    skinSmooth,
    skinWhiten,
    rosyCheeks,
    lipTint,
    vignetteVal,
    selectedFilter,
    selectedFrame,
    frameCaption,
    showDateStamp,
    stickers,
    selectedStickerId,
  ]);

  const handleCanvasPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = renderCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const hit = [...stickers]
      .reverse()
      .find((st) => Math.abs(st.x - clickX) < 10 && Math.abs(st.y - clickY) < 10);

    if (hit) {
      setSelectedStickerId(hit.id);
      setDraggingId(hit.id);
    } else {
      setSelectedStickerId(null);
    }
  };

  const handleCanvasPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingId || !renderCanvasRef.current) return;
    const rect = renderCanvasRef.current.getBoundingClientRect();
    const moveX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const moveY = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));

    setStickers((prev) =>
      prev.map((st) => (st.id === draggingId ? { ...st, x: moveX, y: moveY } : st))
    );
  };

  const handleCanvasPointerUp = () => setDraggingId(null);

  const addSticker = (emoji: string) => {
    const newId = Date.now().toString();
    setStickers((prev) => [...prev, { id: newId, emoji, x: 50, y: 50, scale: 1.5 }]);
    setSelectedStickerId(newId);
  };

  const removeSelectedSticker = () => {
    if (!selectedStickerId) return;
    setStickers((prev) => prev.filter((st) => st.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  const executeCapturePhoto = useCallback(() => {
    const canvas = renderCanvasRef.current;
    if (!canvas) return;
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 180);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const filterPreset = selectedFilter || DEFAULT_FILTER;

    setMediaList((prev) => [
      {
        id: Date.now().toString(),
        type: "photo",
        url: dataUrl,
        timestamp: new Date().toLocaleTimeString("vi-VN"),
        filterName: filterPreset.name,
      },
      ...prev,
    ]);
  }, [selectedFilter]);

  const handleToggleRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const canvas = renderCanvasRef.current;
    if (!canvas) return;

    const canvasStream = (canvas as unknown as { captureStream: (fps: number) => MediaStream }).captureStream(30);
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) canvasStream.addTrack(audioTrack);
    }

    const recorder = new MediaRecorder(canvasStream);
    recordedChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      const filterPreset = selectedFilter || DEFAULT_FILTER;
      setMediaList((prev) => [
        {
          id: Date.now().toString(),
          type: "video",
          url: videoUrl,
          timestamp: new Date().toLocaleTimeString("vi-VN"),
          filterName: filterPreset.name,
        },
        ...prev,
      ]);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
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
                Tải xuống ({mediaList.length})
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

                  {/* CỤM NÚT ZOOM CAMERA */}
<div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
  <button
    onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
    className="w-7 h-7 flex items-center justify-center text-white font-bold hover:bg-white/20 rounded-full transition"
    title="Thu nhỏ"
  >
    -
  </button>
  <span className="text-[11px] font-bold text-pink-400 px-1 min-w-[35px] text-center">
    {zoom.toFixed(1)}x
  </span>
  <button
    onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
    className="w-7 h-7 flex items-center justify-center text-white font-bold hover:bg-white/20 rounded-full transition"
    title="Phóng to"
  >
    +
  </button>
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
        <Download className="w-10 h-10 text-slate-700 animate-bounce" />
        <span className="text-slate-400 text-xs font-bold">
          Chưa có ảnh hoặc video nào được chụp/quay.
        </span>
        <span className="text-slate-500 text-[11px]">
          Hãy bấm nút chụp hoặc quay ở màn hình bên trái để lưu lại tác phẩm!
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
                className="w-14 h-10 object-cover rounded-xl border border-slate-600"
              />
            ) : (
              <video
                src={item.url}
                className="w-14 h-10 object-cover rounded-xl border border-slate-600"
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
        <button
  onClick={async () => {
    // Kiểm tra nếu là thiết bị di động (iPhone/Android) thì dùng bảng chia sẻ
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share && item.type === "photo") {
      try {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const file = new File([blob], `diem10-studio-${item.id}.jpg`, { type: "image/jpeg" });
        await navigator.share({
          files: [file],
          title: "Ảnh chụp từ Điểm 10+",
        });
        return;
      } catch (err) {
        console.log("Share cancelled", err);
      }
    }

    // Trên Laptop: Tải thẳng về máy lập tức không qua bảng trung gian
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `diem10-studio-${item.id}.${item.type === "photo" ? "jpg" : "webm"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }}
  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
>
  <Download className="w-4 h-4" />
  <span>Tải về máy</span>
</button>
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
  );
}