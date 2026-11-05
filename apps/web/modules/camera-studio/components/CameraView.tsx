// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
}

const WUTA_FILTERS: FilterPreset[] = [
  { id: "natural", name: "Cam Thường", badge: "Origin", color: "from-slate-500 to-slate-700", cssFilter: "none" },
  { id: "xingtu1", name: "Xingtu Trong Trẻo", badge: "Hot", color: "from-blue-300 to-cyan-400", cssFilter: "brightness(1.08) contrast(1.05) saturate(1.1)" },
  { id: "peach", name: "Đào Hồng Meitu", badge: "Sweet", color: "from-pink-400 to-rose-500", cssFilter: "brightness(1.1) contrast(1.02) saturate(1.15)" },
  { id: "milktea", name: "Trà Sữa B612", badge: "Warm", color: "from-amber-300 to-orange-400", cssFilter: "brightness(1.05) sepia(0.2) saturate(1.1)" },
];

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(WUTA_FILTERS[1]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function initCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    initCam();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 text-white">
      <div className="relative bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center min-h-[450px]">
        <video ref={videoRef} playsInline muted className="hidden" />
        <canvas ref={canvasRef} className="max-h-[500px] w-auto object-contain" />
        {status === "loading" && <div className="absolute text-pink-400 font-bold">Đang tải Camera...</div>}
      </div>
    </div>
  );
}