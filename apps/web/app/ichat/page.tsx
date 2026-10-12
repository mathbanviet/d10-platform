"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function IChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Xin chào! Em là Trợ lý AI của Điểm 10+. Thầy/Cô hoặc các em học sinh cần hỗ trợ giải bài tập hay tra cứu kiến thức gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Hệ thống đang bận, vui lòng thử lại sau giây lát!" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Có lỗi xảy ra khi kết nối với AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans py-8 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[80vh]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 text-white rounded-t-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-black text-xl shadow-md">
              10+
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">iChat - Trợ lý Hỏi đáp AI</h1>
              <p className="text-xs text-blue-100 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Sẵn sàng hỗ trợ 24/7
              </p>
            </div>
          </div>
          <span className="bg-blue-800/60 text-xs px-3 py-1 rounded-full border border-blue-400/30">Free Gemini AI</span>
        </div>

        {/* KHU VỰC TIN NHẮN */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm md:text-base leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 text-gray-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span>iChat đang suy nghĩ câu trả lời...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BẢNG NHẬP TIN NHẮN */}
        <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi Toán, Lý, Hóa, Văn... hoặc cần giải bài tập tại đây"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Gửi</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}