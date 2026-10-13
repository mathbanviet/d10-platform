"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface GraphPoint {
  x: number;
  y: number;
  label?: string;
}

interface GraphConfig {
  expr?: string;
  exprs?: string[];
  label?: string;
  labels?: string[];
  xRange?: [number, number];
  yRange?: [number, number];
  points?: GraphPoint[];
}

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: { displayMode?: boolean; throwOnError?: boolean }) => string;
    };
  }
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
  const [katexReady, setKatexReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động nạp bộ hiển thị công thức Toán - Lý - Hóa KaTeX
  useEffect(() => {
    if (!document.getElementById("katex-css")) {
      const link = document.createElement("link");
      link.id = "katex-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
      document.head.appendChild(link);
    }

    if (window.katex) {
      setKatexReady(true);
      return;
    }

    const existingScript = document.getElementById("katex-js") as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => setKatexReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "katex-js";
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
    script.async = true;
    script.onload = () => setKatexReady(true);
    document.head.appendChild(script);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Hàm tính giá trị biểu thức y = f(x)
  const evalMathExpr = (exprStr: string, xVal: number): number => {
    try {
      const normalized = exprStr
        .replace(/\\cdot|\\times/g, "*")
        .replace(/\^/g, "**")
        .replace(/(\d)([xX(])/g, "$1*$2")
        .replace(/([xX)])(\d)/g, "$1*$2")
        .replace(/\)\(/g, ")*(")
        .replace(/\bsin\b/g, "Math.sin")
        .replace(/\bcos\b/g, "Math.cos")
        .replace(/\btan\b/g, "Math.tan")
        .replace(/\bsqrt\b/g, "Math.sqrt")
        .replace(/\babs\b/g, "Math.abs")
        .replace(/\bln\b|\blog\b/g, "Math.log")
        .replace(/\bpi\b/gi, "Math.PI")
        .replace(/\bx\b/gi, `(${xVal})`);

      const fn = new Function(`return ${normalized};`);
      const res = Number(fn());
      return Number.isFinite(res) ? res : NaN;
    } catch {
      return NaN;
    }
  };

  // Bộ vẽ đồ thị hàm số chuẩn sách giáo khoa Việt Nam (Oxy, lưới, đường gióng nét đứt)
  const renderFunctionGraph = (jsonStr: string): string => {
    try {
      const config: GraphConfig = JSON.parse(jsonStr.trim());
      const expressions = config.exprs || (config.expr ? [config.expr] : ["x^2"]);
      const [xMin, xMax] = config.xRange || [-4, 4];
      const [yMin, yMax] = config.yRange || [-2, 6];
      const points = config.points || [];

      const width = 420;
      const height = 340;
      const pad = 36;
      const plotW = width - pad * 2;
      const plotH = height - pad * 2;

      const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
      const toSvgY = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * plotH;

      const originX = Math.min(Math.max(toSvgX(0), pad), width - pad);
      const originY = Math.min(Math.max(toSvgY(0), pad), height - pad);

      let svgContent = "";

      // 1. Vẽ lưới tọa độ và số chia vạch
      for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const sx = toSvgX(x);
        svgContent += `<line x1="${sx}" y1="${pad}" x2="${sx}" y2="${height - pad}" stroke="#e5e7eb" stroke-width="1" />`;
        if (x !== 0) {
          svgContent += `<line x1="${sx}" y1="${originY - 3}" x2="${sx}" y2="${originY + 3}" stroke="#374151" stroke-width="1.2" />`;
          svgContent += `<text x="${sx}" y="${originY + 15}" font-size="11" fill="#4b5563" text-anchor="middle">${x}</text>`;
        }
      }

      for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const sy = toSvgY(y);
        svgContent += `<line x1="${pad}" y1="${sy}" x2="${width - pad}" y2="${sy}" stroke="#e5e7eb" stroke-width="1" />`;
        if (y !== 0) {
          svgContent += `<line x1="${originX - 3}" y1="${sy}" x2="${originX + 3}" y2="${sy}" stroke="#374151" stroke-width="1.2" />`;
          svgContent += `<text x="${originX - 8}" y="${sy + 4}" font-size="11" fill="#4b5563" text-anchor="end">${y}</text>`;
        }
      }

      // 2. Vẽ trục Ox, Oy và gốc tọa độ O
      svgContent += `
        <line x1="${pad - 10}" y1="${originY}" x2="${width - pad + 12}" y2="${originY}" stroke="#111827" stroke-width="1.6" />
        <polygon points="${width - pad + 16},${originY} ${width - pad + 8},${originY - 4} ${width - pad + 8},${originY + 4}" fill="#111827" />
        <text x="${width - pad + 14}" y="${originY - 8}" font-size="13" font-style="italic" font-weight="bold" fill="#111827">x</text>

        <line x1="${originX}" y1="${height - pad + 10}" x2="${originX}" y2="${pad - 12}" stroke="#111827" stroke-width="1.6" />
        <polygon points="${originX},${pad - 16} ${originX - 4},${pad - 8} ${originX + 4},${pad - 8}" fill="#111827" />
        <text x="${originX + 10}" y="${pad - 6}" font-size="13" font-style="italic" font-weight="bold" fill="#111827">y</text>

        <text x="${originX - 10}" y="${originY + 15}" font-size="12" font-style="italic" font-weight="bold" fill="#111827">O</text>
      `;

      // 3. Vẽ đường cong đồ thị hàm số
      const colors = ["#2563eb", "#16a34a", "#dc2626"];
      const steps = 300;
      expressions.forEach((expr, idx) => {
        const color = colors[idx % colors.length];
        let pathD = "";
        let drawing = false;
        let prevY = NaN;

        for (let i = 0; i <= steps; i++) {
          const x = xMin + (i / steps) * (xMax - xMin);
          const y = evalMathExpr(expr, x);

          if (
            Number.isFinite(y) &&
            y >= yMin - (yMax - yMin) * 0.15 &&
            y <= yMax + (yMax - yMin) * 0.15
          ) {
            const sx = toSvgX(x).toFixed(2);
            const sy = toSvgY(y).toFixed(2);
            if (drawing && Number.isFinite(prevY) && Math.abs(y - prevY) > (yMax - yMin) * 0.8) {
              drawing = false;
            }
            pathD += drawing ? ` L ${sx} ${sy}` : `M ${sx} ${sy}`;
            drawing = true;
          } else {
            drawing = false;
          }
          prevY = y;
        }

        if (pathD) {
          svgContent += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" />`;
        }
      });

      // 4. Vẽ đường gióng nét đứt và đánh dấu các điểm đặc biệt
      points.forEach((pt) => {
        if (pt.x >= xMin && pt.x <= xMax && pt.y >= yMin && pt.y <= yMax) {
          const px = toSvgX(pt.x);
          const py = toSvgY(pt.y);

          if (pt.x !== 0 && pt.y !== 0) {
            svgContent += `
              <line x1="${px}" y1="${py}" x2="${px}" y2="${originY}" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="${px}" y1="${py}" x2="${originX}" y2="${py}" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 3" />
            `;
          }
          svgContent += `<circle cx="${px}" cy="${py}" r="4" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />`;
        }
      });

      const titleLabel = config.label || `Đồ thị hàm số y = ${expressions[0]}`;

      return `
        <div class="my-3 p-3 bg-white border border-blue-100 rounded-xl shadow-sm flex flex-col items-center">
          <div class="text-xs font-bold text-blue-800 mb-1">${titleLabel}</div>
          <svg viewBox="0 0 ${width} ${height}" class="w-full max-w-[420px] h-auto select-none">
            ${svgContent}
          </svg>
        </div>
      `;
    } catch {
      return "";
    }
  };

  // Hàm định dạng văn bản, kẻ bảng giá trị, hiển thị LaTeX (\dfrac) và vẽ đồ thị
  const formatAIMessage = (rawText: string) => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const renderMath = (tex: string, displayMode: boolean) => {
      // Tự động ép mọi phân số \frac sang \dfrac (kích thước lớn) và hiển thị rõ \lim, \sum, \int
      const cleanTex = tex
        .trim()
        .replace(/\\frac\b/g, "\\dfrac")
        .replace(/\\lim\b/g, "\\displaystyle\\lim")
        .replace(/\\sum\b/g, "\\displaystyle\\sum")
        .replace(/\\int\b/g, "\\displaystyle\\int");

      if (katexReady && window.katex) {
        try {
          return window.katex
            .renderToString(cleanTex, {
              displayMode,
              throwOnError: false,
            })
            .replace(/\r?\n/g, " ");
        } catch {
          // Dự phòng nếu biểu thức lỗi
        }
      }
      const fallback = escapeHtml(cleanTex)
        .replace(/\\times/g, " × ")
        .replace(/\\div/g, " ÷ ")
        .replace(/\\cdot/g, " · ")
        .replace(/\\pm/g, " ± ")
        .replace(/\\leq/g, " ≤ ")
        .replace(/\\geq/g, " ≥ ")
        .replace(/\\neq/g, " ≠ ")
        .replace(/\\rightarrow|\\to/g, " → ")
        .replace(/\\xrightarrow\{([^{}]*)\}/g, " —($1)→ ")
        .replace(/\\Rightarrow/g, " ⇒ ")
        .replace(/\\Leftrightarrow/g, " ⇔ ")
        .replace(/\\LaTeX/g, "LaTeX")
        .replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
        .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");

      return displayMode
        ? `<div class="my-2 py-1.5 px-3 bg-blue-50/70 rounded-lg font-semibold text-blue-950 text-center">${fallback}</div>`
        : `<span class="font-semibold text-blue-900">${fallback}</span>`;
    };

    // 1. Lưu trữ tạm các khối Đồ thị, Hình SVG và Công thức Toán
    const specialBlocks: string[] = [];
    const saveBlock = (html: string) => {
      const id = `@@BLOCK_${specialBlocks.length}@@`;
      specialBlocks.push(html);
      return id;
    };

    // Tách khối vẽ đồ thị ```graph ... ```
    let processed = rawText.replace(/```graph\s*([\s\S]*?)```/gi, (_, json) => {
      const graphHtml = renderFunctionGraph(json);
      return graphHtml ? `\n${saveBlock(graphHtml)}\n` : "";
    });

    // Tách khối hình học ```svg ... ```
    processed = processed.replace(/```svg\s*([\s\S]*?)```/gi, (_, svgCode) => {
      const cleanSvg = svgCode.trim().replace(/\r?\n/g, " ");
      return `\n${saveBlock(`<div class="my-3 p-3 bg-white border border-blue-100 rounded-xl shadow-sm flex justify-center overflow-x-auto">${cleanSvg}</div>`)}\n`;
    });

    // Tách công thức lớn $$...$$ và \[...\]
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      return `\n${saveBlock(`<div class="my-2 overflow-x-auto">${renderMath(tex, true)}</div>`)}\n`;
    });

    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => {
      return `\n${saveBlock(`<div class="my-2 overflow-x-auto">${renderMath(tex, true)}</div>`)}\n`;
    });

    // Tách công thức nhỏ nằm trên cùng dòng $...$ và \(...\)
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, tex) => saveBlock(renderMath(tex, false)));
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => saveBlock(renderMath(tex, false)));

    // 2. Tự động ngắt dòng với các dấu --- hoặc tiêu đề ### bị viết liền
    processed = processed
      .replace(/\s+---\s+/g, "\n---\n")
      .replace(/\s+(#{2,4}\s+)/g, "\n$1");

    // 3. Làm sạch HTML và định dạng chữ
    processed = escapeHtml(processed)
      .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />')
      .replace(/^###\s+(.+)$/gm, '<div class="font-bold text-blue-800 text-base mt-3 mb-1">$1</div>')
      .replace(/^##\s+(.+)$/gm, '<div class="font-bold text-blue-900 text-lg mt-3 mb-1">$1</div>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/^\s*[\*\-]\s+/gm, "• ")
      .replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // 4. Tách dòng và tự động gom các dòng có dấu |...| thành Bảng kẻ ô (Table)
    const rawLines = processed
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const groupedBlocks: string[] = [];
    let idx = 0;

    while (idx < rawLines.length) {
      if (/^\|.*\|$/.test(rawLines[idx])) {
        const tableLines: string[] = [];
        while (idx < rawLines.length && /^\|.*\|$/.test(rawLines[idx])) {
          tableLines.push(rawLines[idx]);
          idx++;
        }

        // Lọc bỏ dòng phân cách | :---: | :---: |
        const validRows = tableLines.filter((row) => {
          const cells = row.slice(1, -1).split("|").map((c) => c.trim());
          return !cells.every((c) => /^[:\-\s]+$/.test(c));
        });

        if (validRows.length > 0) {
          const rowsHtml = validRows
            .map((row, rIdx) => {
              const cells = row.slice(1, -1).split("|").map((c) => c.trim());
              const cellsHtml = cells
                .map((cell, cIdx) => {
                  const isHeaderCell = cIdx === 0 || (rIdx === 0 && validRows.length > 2);
                  const cellStyle = isHeaderCell
                    ? "bg-blue-50/80 font-semibold text-blue-950"
                    : "bg-white text-gray-800";
                  return `<td class="border border-blue-200 px-3.5 py-2 text-center ${cellStyle}">${cell}</td>`;
                })
                .join("");
              return `<tr>${cellsHtml}</tr>`;
            })
            .join("");

          groupedBlocks.push(
            `<div class="my-2.5 overflow-x-auto"><table class="border-collapse border border-blue-200 text-sm md:text-base">${rowsHtml}</table></div>`
          );
        }
      } else {
        groupedBlocks.push(rawLines[idx]);
        idx++;
      }
    }

    // 5. Khôi phục khối Đồ thị, SVG và Công thức Toán vào từng dòng/bảng
    return groupedBlocks.map((block, i) => {
      const restoredBlock = block.replace(/@@BLOCK_(\d+)@@/g, (_, bIdx) => specialBlocks[Number(bIdx)] || "");
      return (
        <div
          key={i}
          className="leading-loose py-0.5"
          dangerouslySetInnerHTML={{ __html: restoredBlock }}
        />
      );
    });
  };

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
          <span className="bg-blue-800/60 text-xs px-3 py-1 rounded-full border border-blue-400/30">10 Plus AI</span>
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
                    ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none space-y-2"
                }`}
              >
                {msg.sender === "user" ? msg.text : formatAIMessage(msg.text)}
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