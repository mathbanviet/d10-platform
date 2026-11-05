"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Palette,
  Video,
  ArrowLeft,
  Download,
  Play,
  StopCircle,
  ShieldCheck,
} from "lucide-react";

export default function MediaStudioPage() {
  const [activeTab, setActiveTab] = useState<"canvas" | "recorder">("canvas");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#0f172a");
  const [textContent, setTextContent] = useState<string>("Điểm 10+ Edu Studio");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [fontSize, setFontSize] = useState<number>(36);
  const [selectedShape, setSelectedShape] = useState<"none" | "rect" | "circle">("rect");

  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecordingScreen, setIsRecordingScreen] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "canvas") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 960;
    canvas.height = 540;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    if (selectedShape === "rect") {
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fillRect(100, 150, 250, 240);
    } else if (selectedShape === "circle") {
      ctx.fillStyle = "rgba(236, 72, 153, 0.25)";
      ctx.beginPath();
      ctx.arc(225, 270, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(textContent, canvas.width / 2, canvas.height / 2 + 15);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Hệ thống Giáo dục Điểm 10+ • d10hub.io.vn", canvas.width / 2, canvas.height - 50);
  }, [activeTab, bgColor, textContent, textColor, fontSize, selectedShape]);

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `diem10-thiet-ke-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleStartScreenRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as any,
        audio: true,
      });

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play();
      }

      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          handleStopScreenRecord();
        };
      }

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingScreen(true);
    } catch (err) {
      alert("Không thể khởi động quay màn hình.");
    }
  };

  const handleStopScreenRecord = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (screenVideoRef.current && screenVideoRef.current.srcObject) {
      const stream = screenVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecordingScreen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Link
            href="/apps-new"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Ứng Dụng</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sáng tạo đa phương tiện • 0đ Server</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
            <Palette className="w-8 h-8 text-purple-400" />
            <span>Canva & CapCut Edu Studio</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Thiết kế flashcard, bìa bài giảng và quay màn hình bài giảng trực tiếp ngay trên trình duyệt.
          </p>
        </div>

        <div className="grid grid-cols-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("canvas")}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "canvas" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Thiết kế Bìa & Flashcard (Canva)</span>
          </button>
          <button
            onClick={() => setActiveTab("recorder")}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "recorder" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Quay màn hình bài giảng (CapCut)</span>
          </button>
        </div>

        {activeTab === "canvas" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-center shadow-2xl">
              <canvas ref={canvasRef} className="w-full h-auto rounded-2xl border border-slate-700 shadow-lg" />
            </div>

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5">
              <h2 className="font-bold text-sm text-purple-400 border-b border-slate-800 pb-2">
                CÔNG CỤ THIẾT KẾ
              </h2>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nội dung tiêu đề:</label>
                <input
                  type="text"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Màu nền:</label>
                  <select
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="#0f172a">Xanh đậm tối</option>
                    <option value="#581c87">Tím hoàng gia</option>
                    <option value="#14532d">Xanh lá Điểm 10+</option>
                    <option value="#7f1d1d">Đỏ nổi bật</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Hình khối:</label>
                  <select
                    value={selectedShape}
                    onChange={(e: any) => setSelectedShape(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="none">Không có</option>
                    <option value="rect">Hình chữ nhật</option>
                    <option value="circle">Hình tròn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Cỡ chữ: {fontSize}px</label>
                <input
                  type="range"
                  min="24"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <button
                onClick={handleDownloadCanvas}
                className="w-full mt-auto py-3 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh thiết kế về máy</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-6 shadow-2xl">
            <div className="relative aspect-video w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
              <video ref={screenVideoRef} playsInline muted className="w-full h-full object-contain" />
              {!isRecordingScreen && !recordedVideoUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80">
                  <Video className="w-12 h-12 text-purple-400 animate-pulse" />
                  <p className="text-sm font-bold">Sẵn sàng ghi hình bài giảng màn hình</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!isRecordingScreen ? (
                <button
                  onClick={handleStartScreenRecord}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Bắt đầu quay màn hình</span>
                </button>
              ) : (
                <button
                  onClick={handleStopScreenRecord}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-red-500 text-red-400 rounded-2xl font-bold text-sm flex items-center gap-2 transition animate-pulse"
                >
                  <StopCircle className="w-4 h-4 fill-red-400" />
                  <span>Dừng quay</span>
                </button>
              )}
            </div>

            {recordedVideoUrl && (
              <div className="w-full max-w-3xl flex flex-col gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="font-bold text-sm text-emerald-400">Video bài giảng đã quay thành công!</p>
                <video src={recordedVideoUrl} controls className="w-full rounded-xl border border-slate-700" />
                <a
                  href={recordedVideoUrl}
                  download={`bai-giang-diem10-${Date.now()}.webm`}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl shadow transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải video bài giảng về máy</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}