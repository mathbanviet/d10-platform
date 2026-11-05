"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
  Video,
  Play,
  Pause,
  SkipForward,
  Clock,
  RefreshCcw,
  CheckCircle2,
  Volume2
} from "lucide-react";

interface ShortVideo {
  id: string;
  title: string;
  subject: string;
  duration: string;
  color: string;
}

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
}

const MOCK_SHORTS: ShortVideo[] = [
  { id: "v1", title: "Mẹo chứng minh BĐT AM-GM (Kỹ thuật điểm rơi)", subject: "Toán 9", duration: "0:59", color: "bg-blue-900" },
  { id: "v2", title: "Cấu trúc ăn điểm Speaking C1 - IELTS/TOEFL", subject: "Tiếng Anh", duration: "0:45", color: "bg-emerald-900" },
  { id: "v3", title: "Giải nhanh trắc nghiệm Toán KNTT Điểm 10+", subject: "Toán", duration: "0:50", color: "bg-purple-900" },
];

const MOCK_TRACKS: LofiTrack[] = [
  { id: "t1", title: "Bài ca hy vọng (Lofi Chill Remix)", artist: "Điểm 10+ Beats" },
  { id: "t2", title: "Cho em một ngày (Acoustic Study)", artist: "Lofi Vibes" },
  { id: "t3", title: "Deep Focus - Mưa rơi", artist: "Hồng Vân Picks" },
];

export default function EduShortsLofiPage() {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<"work" | "break">("work");

  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentShortIndex, setCurrentShortIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (timerMode === "work") {
        setTimerMode("break");
        setTimeLeft(5 * 60);
      } else {
        setTimerMode("work");
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, timerMode]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerMode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleToggleMusic = () => {
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_TRACKS.length);
    setIsPlayingMusic(true);
  };

  const handleNextShort = () => {
    setCurrentShortIndex((prev) => (prev + 1) % MOCK_SHORTS.length);
    setIsPlayingVideo(true);
  };

  // Áp dụng fix TypeScript (Fallback toán tử ??)
  const currentTrack = MOCK_TRACKS[currentTrackIndex]!;
const currentShort = MOCK_SHORTS[currentShortIndex]!;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8 select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Link href="/apps-new" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Ứng Dụng</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Không quảng cáo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[600px] overflow-hidden relative">
              <div className="flex items-center justify-between mb-4 z-10">
                <h2 className="font-extrabold text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-pink-500" />
                  EduShorts Bài Giảng
                </h2>
                <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">
                  {currentShort.subject}
                </span>
              </div>

              <div 
                className={`flex-1 rounded-2xl ${currentShort.color} flex flex-col items-center justify-center relative cursor-pointer group`}
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                  {!isPlayingVideo && <Play className="w-16 h-16 text-white/80" fill="currentColor" />}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white shadow-sm mb-2 leading-tight">
                    {currentShort.title}
                  </h3>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full w-1/3 animate-pulse" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNextShort}
                className="mt-4 w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2"
              >
                Lướt video tiếp theo
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
              <Clock className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="flex gap-2 mb-6 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold w-full max-w-xs">
                <button 
                  onClick={() => { setTimerMode("work"); setTimeLeft(25 * 60); setIsTimerRunning(false); }}
                  className={`flex-1 py-2 rounded-lg transition ${timerMode === "work" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Tập trung
                </button>
                <button 
                  onClick={() => { setTimerMode("break"); setTimeLeft(5 * 60); setIsTimerRunning(false); }}
                  className={`flex-1 py-2 rounded-lg transition ${timerMode === "break" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Nghỉ ngơi
                </button>
              </div>
              
              <div className="text-7xl font-black text-white tracking-widest font-mono mb-8 drop-shadow-lg">
                {formatTime(timeLeft)}
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleTimer}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${isTimerRunning ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
                >
                  {isTimerRunning ? <Pause className="w-7 h-7" fill="currentColor" /> : <Play className="w-7 h-7 pl-1" fill="currentColor" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col flex-1">
              <h2 className="font-extrabold text-sm flex items-center gap-2 mb-6 text-purple-400">
                <Music className="w-5 h-5" />
                Phòng Học Lofi
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlayingMusic ? 'running' : 'paused' }}>
                  <Music className="w-6 h-6 text-white/50" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-white text-lg truncate">{currentTrack.title}</h4>
                  <p className="text-slate-400 text-xs mt-1">{currentTrack.artist}</p>
                </div>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 relative">
                <div className={`bg-purple-500 h-full rounded-full transition-all duration-1000 ${isPlayingMusic ? 'w-2/3' : 'w-1/4'}`} />
              </div>

              <div className="flex items-center justify-between mt-auto px-4">
                <button className="text-slate-400 hover:text-white transition">
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleToggleMusic}
                    className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition"
                  >
                    {isPlayingMusic ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 pl-1" fill="currentColor" />}
                  </button>
                  <button 
                    onClick={handleNextTrack}
                    className="text-slate-400 hover:text-white transition"
                  >
                    <SkipForward className="w-6 h-6" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}