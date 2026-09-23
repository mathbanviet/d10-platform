"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. IMPORT THƯ VIỆN LATEX
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// 2. DỮ LIỆU ĐÃ CHUYỂN SANG CHUẨN LATEX (Bọc trong dấu $)
// Chú ý: Ký hiệu ngoặc nhọn hoặc \ phải thêm một dấu \ phía trước trong chuỗi string của JS
const MOCK_QUESTIONS = [
  { id: 1, content: 'Tập nghiệm của phương trình $x^2 - 4 = 0$ là:', options: ['A. $\\{2\\}$', 'B. $\\{-2\\}$', 'C. $\\{-2; 2\\}$', 'D. Vô nghiệm'], correct: 2 },
  { id: 2, content: 'Đạo hàm của hàm số $y = \\sin(x)$ là:', options: ['A. $y\' = \\cos(x)$', 'B. $y\' = -\\cos(x)$', 'C. $y\' = \\sin(x)$', 'D. $y\' = -\\sin(x)$'], correct: 0 },
  { id: 3, content: 'Cho khối chóp có diện tích đáy $B=3$, chiều cao $h=4$. Thể tích khối chóp là:', options: ['A. $12$', 'B. $4$', 'C. $6$', 'D. $36$'], correct: 1 },
  { id: 4, content: 'Một hệ phương trình bậc nhất hai ẩn có đồ thị là hai đường thẳng song song thì hệ đó:', options: ['A. Có vô số nghiệm', 'B. Vô nghiệm', 'C. Có nghiệm duy nhất', 'D. Không xác định'], correct: 1 },
];

export default function PracticeRoomPage() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) handleSubmit(); 
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isSubmitted) return; 
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    const isConfirm = confirm("Bạn có chắc chắn muốn nộp bài không?");
    if (!isConfirm) return;

    let correctCount = 0;
    MOCK_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setTimeSpent(15 * 60 - timeLeft); 
    setIsSubmitted(true);
  };

  const currentQ = MOCK_QUESTIONS[currentQuestionIdx];

  if (!currentQ) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải câu hỏi...</div>;
  }

  if (isSubmitted) {
    const totalQ = MOCK_QUESTIONS.length;
    const score10 = ((score / totalQ) * 10).toFixed(1); 

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center font-sans">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-blue-600 p-8 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">KẾT QUẢ BÀI THI</h1>
            <p className="text-blue-100">Hoàn thành lúc {new Date().toLocaleTimeString('vi-VN')}</p>
          </div>
          
          <div className="p-8">
            <div className="flex justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-blue-600 flex items-center justify-center mx-auto mb-3 bg-blue-50">
                  <span className="text-3xl font-black text-blue-600">{score10}</span>
                </div>
                <p className="text-gray-600 font-bold">ĐIỂM SỐ</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-3 bg-green-50">
                  <span className="text-3xl font-black text-green-600">{score}/{totalQ}</span>
                </div>
                <p className="text-gray-600 font-bold">SỐ CÂU ĐÚNG</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center mx-auto mb-3 bg-orange-50">
                  <span className="text-2xl font-black text-orange-600">{formatTime(timeSpent)}</span>
                </div>
                <p className="text-gray-600 font-bold">THỜI GIAN</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
                Làm lại bài thi
              </button>
              <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans pb-10">
      <div className="bg-white shadow-sm flex justify-between items-center px-4 md:px-8 py-3 mb-6">
        <h1 className="text-lg font-bold text-gray-700 hidden md:block">BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC</h1>
        <div className="flex items-center gap-6 ml-auto">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-bold uppercase">Thời gian còn lại</span>
            <div className={`text-2xl font-black tabular-nums ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
          >
            NỘP BÀI
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 gap-6">
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm p-5 border border-gray-200 self-start">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2">
            {MOCK_QUESTIONS.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isActive = currentQuestionIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`
                    w-10 h-10 rounded font-bold border flex items-center justify-center transition
                    ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div> Đã làm: {Object.keys(answers).length}</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-gray-300 rounded bg-white"></div> Chưa làm: {MOCK_QUESTIONS.length - Object.keys(answers).length}</div>
          </div>
        </div>

        <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-200 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 pb-4 border-b border-gray-100">
              Câu {currentQuestionIdx + 1}:
            </h2>
            {/* 3. SỬ DỤNG THẺ <Latex> ĐỂ RENDER CÂU HỎI */}
            <div className="text-lg text-gray-800 leading-relaxed font-medium">
              <Latex>{currentQ.content}</Latex>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              return (
                <label 
                  key={optIdx} 
                  className={`
                    flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={optIdx}
                    checked={isSelected}
                    onChange={() => handleSelectOption(currentQ.id, optIdx)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-4 flex-shrink-0"
                  />
                  {/* 4. SỬ DỤNG THẺ <Latex> ĐỂ RENDER ĐÁP ÁN */}
                  <span className="text-lg font-medium flex-grow"><Latex>{opt}</Latex></span>
                </label>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
            >
              ← Câu trước
            </button>

            {currentQuestionIdx === MOCK_QUESTIONS.length - 1 ? (
              <button 
                onClick={handleSubmit}
                className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition hover:scale-105 transform"
              >
                Hoàn thành & Nộp bài
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIdx(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                className="px-6 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition"
              >
                Câu tiếp →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}