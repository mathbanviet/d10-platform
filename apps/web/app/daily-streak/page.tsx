"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Mic,
  MicOff,
  Play,
  CheckCircle2,
  XCircle,
  Timer,
  ListPlus,
  RefreshCcw,
  StopCircle
} from "lucide-react";

interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    subject: "Toán KNTT",
    text: "Giá trị lớn nhất của hàm số y = -x^2 + 4x + 5 là bao nhiêu?",
    options: ["5", "9", "4", "0"],
    correctAnswer: 1,
  },
  {
    id: "q2",
    subject: "Tiếng Anh",
    text: "Chọn từ đúng: She usually ______ to school by bus.",
    options: ["go", "going", "goes", "went"],
    correctAnswer: 2,
  },
  {
    id: "q3",
    subject: "Toán 9",
    text: "Nghiệm của phương trình 2x - 4 = 0 là:",
    options: ["x = 2", "x = -2", "x = 4", "x = 0"],
    correctAnswer: 0,
  }
];

export default function DailyStreakPage() {
  const [activeTab, setActiveTab] = useState<"challenge" | "voice" | "leaderboard">("challenge");
  
  // --- STREAK & CHALLENGE STATE ---
  const [streakDays, setStreakDays] = useState<number>(14);
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 5 phút
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // --- VOICE NOTE STATE ---
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Timer Logic (Đã bọc ReturnType an toàn)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isChallengeActive && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isChallengeActive) {
      handleFinishChallenge();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isChallengeActive, timeLeft, isFinished]);

  const handleStartChallenge = () => {
    setIsChallengeActive(true);
    setIsFinished(false);
    setTimeLeft(5 * 60);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    
    const currentQ = MOCK_QUESTIONS[currentQIndex]!;
    if (index === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQIndex < MOCK_QUESTIONS.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        handleFinishChallenge();
      }
    }, 1000);
  };

  const handleFinishChallenge = () => {
    setIsFinished(true);
    setIsChallengeActive(false);
    if (score >= MOCK_QUESTIONS.length / 2) {
      setStreakDays((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Voice Note Logic (Bọc kiểm tra an toàn theo chuẩn PDF Studio)
  const handleToggleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert("Vui lòng cấp quyền micro để ghi chú giọng nói.");
    }
  };

  // Áp dụng Fallback Nullish Coalescing (??) cho mảng
  const currentQ = MOCK_QUESTIONS[currentQIndex]!;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Link href="/apps-new" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Ứng Dụng</span>
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold shadow-lg shadow-orange-500/10">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span>{streakDays} Ngày Chuỗi Lửa</span>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="grid grid-cols-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button 
            onClick={() => setActiveTab("challenge")}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === "challenge" ? "bg-orange-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <Timer className="w-4 h-4" /> <span>5 Phút Thử Thách</span>
          </button>
          <button 
            onClick={() => setActiveTab("voice")}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === "voice" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <Mic className="w-4 h-4" /> <span>Ghi Chú AI</span>
          </button>
          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${activeTab === "leaderboard" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <Trophy className="w-4 h-4" /> <span>Bảng Xếp Hạng</span>
          </button>
        </div>

        {/* TAB 1: CHALLENGE */}
        {activeTab === "challenge" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col items-center min-h-[400px]">
            {!isChallengeActive && !isFinished ? (
              <div className="text-center flex flex-col items-center justify-center h-full my-auto gap-4">
                <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                  <Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black">Giữ Lửa 5 Phút Mỗi Ngày</h2>
                <p className="text-slate-400 text-sm max-w-sm">Hoàn thành bài trắc nghiệm phản xạ nhanh trước khi hết giờ để giữ vững chuỗi Streak của bạn.</p>
                <button 
                  onClick={handleStartChallenge}
                  className="mt-6 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-600/30 transition flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" /> Bắt Đầu Ngay
                </button>
              </div>
            ) : isFinished ? (
              <div className="text-center flex flex-col items-center justify-center h-full my-auto gap-4">
                <Trophy className={`w-20 h-20 mb-2 ${score >= 2 ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`} />
                <h2 className="text-3xl font-black">{score >= 2 ? "Thử Thách Thành Công!" : "Cố Gắng Lần Sau"}</h2>
                <p className="text-slate-300">Bạn trả lời đúng {score}/{MOCK_QUESTIONS.length} câu hỏi.</p>
                <button 
                  onClick={handleStartChallenge}
                  className="mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Luyện tập lại
                </button>
              </div>
            ) : (
              <div className="w-full max-w-2xl flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg border border-orange-500/30">
                    {currentQ.subject}
                  </span>
                  <div className="flex items-center gap-2 text-2xl font-mono font-black text-white bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                    <Timer className="w-5 h-5 text-orange-500" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl mb-6 shadow-inner">
                  <h3 className="text-xl font-bold leading-relaxed">{currentQ.text}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswer;
                    const showResult = selectedOption !== null;
                    
                    let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200";
                    if (showResult) {
                      if (isCorrect) btnClass = "bg-emerald-600/20 border-emerald-500 text-emerald-400";
                      else if (isSelected) btnClass = "bg-red-600/20 border-red-500 text-red-400";
                      else btnClass = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                        className={`p-4 rounded-xl border-2 text-left font-bold transition flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-8 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-500" 
                    style={{ width: `${((currentQIndex) / MOCK_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VOICE NOTE AI */}
        {activeTab === "voice" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center mb-10">
              <Mic className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">Ghi Chú Giọng Nói</h2>
              <p className="text-slate-400 text-sm">Ghi âm nhanh các ý tưởng hoặc mẹo giải bài tập.</p>
            </div>
            
            <button 
              onClick={handleToggleRecord}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition shadow-2xl ${isRecording ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse border-4 border-red-500" : "bg-emerald-600 text-white hover:bg-emerald-500 border-4 border-emerald-500"}`}
            >
              {isRecording ? <StopCircle className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRecording ? "Đang Ghi Âm..." : "Nhấn để thu âm"}</p>

            {audioUrl && !isRecording && (
              <div className="mt-10 w-full max-w-md bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                <audio src={audioUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[400px]">
             <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <Trophy className="w-6 h-6 text-indigo-400" />
                <h2 className="text-lg font-black text-white">Bảng Xếp Hạng Streak Điểm 10+</h2>
             </div>
             
             <div className="flex flex-col gap-3">
                {[
                  { rank: 1, name: "Nguyễn Văn A", streak: 45, color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
                  { rank: 2, name: "Trần Thị B", streak: 32, color: "bg-slate-300/20 text-slate-300 border-slate-300/30" },
                  { rank: 3, name: "Lê Hoàng C", streak: 28, color: "bg-orange-700/20 text-orange-400 border-orange-700/30" },
                  { rank: 4, name: "Bạn (Hồng Vân)", streak: streakDays, color: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" },
                ].map((user) => (
                  <div key={user.rank} className={`flex items-center justify-between p-4 rounded-xl border ${user.color}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-xl w-6 text-center">{user.rank}</span>
                      <span className="font-bold">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-black">
                      {user.streak} <Flame className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}