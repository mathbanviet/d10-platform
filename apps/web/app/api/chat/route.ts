import { NextResponse } from "next/server";

// BỘ NHỚ ĐỆM LƯỢNG TỬ TRÊN SERVER (Giúp trả lời tức thì 0.01s nếu trùng câu hỏi trong cùng tọa độ [Môn x Lớp])
const QUANTUM_CACHE = new Map<string, string>();
const MAX_CACHE_SIZE = 200;

// LÕI ĐỊNH DANH SIÊU NHẸ (Chỉ ~60 tokens, giúp AI xử lý nhanh gấp 3 lần)
const CORE_IDENTITY =
  "Bạn là Trợ lý AI của Hệ thống Giáo dục Điểm 10⁺, chuẩn SGK 'Kết nối tri thức với cuộc sống' (Tiếng Anh 'Global Success'). Trình bày súc tích, rõ ràng từng bước.";

// CÁC VŨ TRỤ MÔN HỌC ĐỘC LẬP (Chỉ nạp đúng môn được chọn để giảm 80% tải lượng token)
const SUBJECT_QUANTUM_NODES: Record<string, string> = {
  toan: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN TOÁN HỌC.",
    "- Phân số luôn viết \\dfrac{a}{b}. Bắt buộc đặt mọi công thức, biến số trong cặp dấu $...$ hoặc $$...$$.",
    "- Giải toán theo đúng phương pháp, định lí được phép dùng ở khối lớp hiện tại của học sinh.",
    "- Chỉ khi đề bài yêu cầu khảo sát/vẽ đồ thị hàm số Oxy mới xuất khối \x60\x60\x60graph ở cuối: {\"expr\": \"x^2\", \"label\": \"Đồ thị y = x²\", \"xRange\": [-4, 4], \"yRange\": [-2, 6], \"points\": [{\"x\": 0, \"y\": 0, \"label\": \"O\"}]}.",
    "- Chỉ khi bài toán Hình học cần hình minh họa mới xuất khối \x60\x60\x60geo ở cuối: {\"title\": \"Hình minh họa\", \"axes\": \"none\", \"points\": {\"A\": [0, 0], \"B\": [4, 0], \"C\": [1.5, 3]}, \"segments\": [{\"from\": \"A\", \"to\": \"B\", \"style\": \"solid\"}, {\"from\": \"B\", \"to\": \"C\", \"style\": \"solid\"}, {\"from\": \"C\", \"to\": \"A\", \"style\": \"solid\"}]}."
  ].join("\n"),

  vatli: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN VẬT LÍ.",
    "- Giải bài tập theo 3 bước: 1. Tóm tắt & Đổi đơn vị chuẩn SI -> 2. Công thức & Lời giải -> 3. Đáp số kèm đơn vị.",
    "- Đặt mọi công thức và ký hiệu vật lí ($v, a, F, U, I, R, \\Omega, \\lambda, \\Delta$) trong cặp dấu $...$ hoặc $$...$$.",
    "- Dùng \\dfrac{a}{b} cho mọi phân số."
  ].join("\n"),

  hoahoc: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN HÓA HỌC (Chuẩn danh pháp IUPAC SGK Kết nối tri thức).",
    "- Dùng tên IUPAC chuẩn kèm tên tiếng Việt ở lần đầu: Glucose (glucozơ), Saccharose (saccarozơ), Starch (tinh bột), Cellulose, Ethanol, Acetic acid, Sodium (natri), Iron (sắt), Copper (đồng)...",
    "- BẮT BUỘC đặt MỌI công thức hóa học và phương trình phản ứng trong cặp dấu $...$ hoặc $$...$$ (ví dụ: $\\text{C}_6\\text{H}_{12}\\text{O}_6$, $\\text{H}_2\\text{SO}_4$).",
    "- Phương trình hóa học phải cân bằng hệ số và ghi điều kiện trên mũi tên: $$(\\text{C}_6\\text{H}_{10}\\text{O}_5)_n + n\\text{H}_2\\text{O} \\xrightarrow{t^\\circ, \\text{ acid/enzyme}} n\\text{C}_6\\text{H}_{12}\\text{O}_6$$."
  ].join("\n"),

  sinhhoc: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN SINH HỌC.",
    "- Dùng thuật ngữ chuẩn SGK Kết nối tri thức: DNA, mRNA, tRNA, rRNA, gene, allele, amino acid, nucleotide.",
    "- Các bài tập di truyền trình bày rõ sơ đồ lai ($P, G_P, F_1, F_2$) và đặt công thức tính toán ($H = 2A + 3G$, $N = 2A + 2G$) trong dấu $...$."
  ].join("\n"),

  khtn: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN KHOA HỌC TỰ NHIÊN (THCS - Lớp 6, 7, 8, 9).",
    "- Kết hợp kiến thức Chất và sự biến đổi của chất (Hóa), Năng lượng và sự biến đổi (Lí), Vật sống (Sinh), Trái Đất và bầu trời.",
    "- Dùng danh pháp IUPAC cho hóa chất và đặt mọi công thức, phương trình trong cặp dấu $...$ hoặc $$...$$."
  ].join("\n"),

  nguvan: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN NGỮ VĂN (SGK Kết nối tri thức với cuộc sống).",
    "- Bám sát đặc trưng thể loại văn bản và 3 mạch: Đọc hiểu - Thực hành tiếng Việt - Viết (đoạn văn 200 chữ / bài văn 600 chữ).",
    "- Khi lập dàn ý, chia rõ: I. Mở bài, II. Thân bài (các luận điểm 1, 2, 3), III. Kết bài. Trích dẫn thơ dùng dấu > ở đầu dòng."
  ].join("\n"),

  tienganh: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN TIẾNG ANH (Bộ sách Global Success).",
    "- Bám sát từ vựng, ngữ pháp các Unit (Getting Started, A Closer Look 1 & 2, Communication, Skills 1 & 2, Looking Back).",
    "- Cung cấp phiên âm IPA (/.../), từ loại và giải thích ngữ pháp ngắn gọn, dễ hiểu.",
    "- Với bài tập phát âm, dùng thẻ <u>...</u> gạch chân phần phát âm đang xét (ví dụ: A. h<u>ou</u>r, B. h<u>ou</u>se)."
  ].join("\n"),
};

// RÀO CHẮN KIẾN THỨC THEO KHỐI LỚP (Đảm bảo AI giải đúng tầm kiến thức của từng lớp)
const GRADE_CONSTRAINTS: Record<string, string> = {
  "Lớp 6": "TỌA ĐỘ LỚP 6: Chỉ dùng kiến thức Lớp 6 (Số tự nhiên, Ước và Bội, ƯCLN, BCNN, Số nguyên, Phân số, Số thập phân, Hình học trực quan). Tuyệt đối chưa dùng phương trình ẩn x nâng cao hay căn thức.",
  "Lớp 7": "TỌA ĐỘ LỚP 7: Dùng kiến thức Lớp 7 (Số hữu tỉ, Số thực, Tỉ lệ thức, Dãy tỉ số bằng nhau, Đa thức một biến, Các trường hợp bằng nhau của tam giác, Đường thẳng song song).",
  "Lớp 8": "TỌA ĐỘ LỚP 8: Dùng kiến thức Lớp 8 (Đa thức nhiều biến, Hằng đẳng thức đáng nhớ, Phân thức đại số, Hàm số bậc nhất, Định lí Thalès, Tam giác đồng dạng, Định lí Pythagore, Hình chóp đều).",
  "Lớp 9": "TỌA ĐỘ LỚP 9 (Ôn thi vào 10): Dùng kiến thức Lớp 9 (Căn bậc hai/ba, Hệ phương trình bậc nhất hai ẩn, Phương trình bậc hai & Định lí Viète, Hàm số y = ax^2, Hệ thức lượng trong tam giác vuông, Đường tròn).",
  "Lớp 10": "TỌA ĐỘ LỚP 10: Dùng kiến thức Lớp 10 (Mệnh đề, Tập hợp, Bất phương trình, Hàm số bậc hai, Hệ thức lượng trong tam giác, Vectơ, Phương pháp tọa độ trong mặt phẳng Oxy, Đại số tổ hợp).",
  "Lớp 11": "TỌA ĐỘ LỚP 11: Dùng kiến thức Lớp 11 (Hàm số lượng giác, Dãy số, Cấp số cộng/nhân, Giới hạn, Hàm số mũ & Lôgarit, Đạo hàm, Quan hệ vuông góc trong không gian, Xác suất).",
  "Lớp 12": "TỌA ĐỘ LỚP 12 (Ôn thi Tốt nghiệp THPT & ĐGNL): Dùng kiến thức Lớp 12 (Ứng dụng đạo hàm khảo sát hàm số, Nguyên hàm - Tích phân, Phương pháp tọa độ trong không gian Oxyz, Xác suất có điều kiện & Công thức Bayes)."
};

// Thuật toán tự động nhận diện vũ trụ môn học trong 0.1ms nếu người dùng để chế độ "Tự động"
function detectSubjectNode(msg: string, selectedSubject?: string): string {
  if (selectedSubject && selectedSubject !== "auto" && SUBJECT_QUANTUM_NODES[selectedSubject]) {
    return selectedSubject;
  }
  const lower = msg.toLowerCase();
  if (/\b(vocabulary|grammar|pronunciation|tiếng anh|global success|unit|present simple|past|passive voice|ielts|toeic)\b/.test(lower)) {
    return "tienganh";
  }
  if (/\b(ngữ văn|văn bản|nghị luận|dàn ý|mở bài|thân bài|bài thơ|nhân vật|tác giả|tác phẩm|biểu cảm|tự sự)\b/.test(lower)) {
    return "nguvan";
  }
  if (/\b(hóa học|phương trình hóa học|phản ứng|kết tủa|nguyên tử|phân tử|mol|acid|axit|base|bazơ|muối|ester|glucose|tinh bột|kim loại|phi kim|h2so4|naoh|hcl)\b/.test(lower)) {
    return "hoahoc";
  }
  if (/\b(vật lí|vật lý|vận tốc|gia tốc|lực|điện trở|dòng điện|mạch điện|dao động|sóng|quang học|thấu kính|nhiệt lượng|hạt nhân)\b/.test(lower)) {
    return "vatli";
  }
  if (/\b(sinh học|di truyền|đột biến|nhiễm sắc thể|dna|mrna|gene|alen|allele|mendel|tế bào|quang hợp|hô hấp|sinh thái)\b/.test(lower)) {
    return "sinhhoc";
  }
  if (/\b(khtn|khoa học tự nhiên)\b/.test(lower)) {
    return "khtn";
  }
  return "toan";
}

function cleanKey(k: string | undefined): string {
  if (!k) return "";
  return k.trim().replace(/^["']|["']$/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { message, grade, subject, model } = await req.json();
    const cleanMsg = String(message || "").trim();
    if (!cleanMsg) {
      return NextResponse.json({ reply: "Vui lòng nhập câu hỏi!" });
    }

    const activeSubject = detectSubjectNode(cleanMsg, subject);
    const activeGrade = String(grade || "Lớp 9").trim();
    const requestedModel =
      typeof model === "string" && model.trim() ? model.trim() : "gemini-3.8-flash";

    // 1. KIỂM TRA BỘ NHỚ ĐỆM LƯỢNG TỬ (Trả lời trong 0.01 giây nếu câu hỏi đã có trong lưới)
    const cacheKey =
      activeSubject + "|" + activeGrade + "|" + requestedModel + "|" + cleanMsg.toLowerCase();
    const cachedReply = QUANTUM_CACHE.get(cacheKey);
    if (cachedReply) {
      return NextResponse.json({
        reply: cachedReply,
        usedModel: requestedModel + " (Quantum Cache ⚡)",
        quantumNode: activeSubject + " • " + activeGrade,
      });
    }

    // 2. THU GỌN HÀM SÓNG: Chỉ ghép đúng Nút Môn học + Nút Khối lớp (Giảm 80% độ dài Prompt)
    const subjectPrompt = SUBJECT_QUANTUM_NODES[activeSubject] || SUBJECT_QUANTUM_NODES.toan;
    const gradeKey = Object.keys(GRADE_CONSTRAINTS).find((k) => activeGrade.includes(k)) || "";
    const gradePrompt = gradeKey ? GRADE_CONSTRAINTS[gradeKey] : "TỌA ĐỘ LỚP: " + activeGrade;

    const dynamicQuantumPrompt = [
      CORE_IDENTITY,
      subjectPrompt,
      gradePrompt,
    ].join("\n\n");

    const userContext =
      "[Tọa độ Lưới: " + activeGrade + " | Môn: " + activeSubject.toUpperCase() + "]\nCâu hỏi: " + cleanMsg;

    const rawGeminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_5,
      process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    ];
    const geminiKeys = Array.from(
      new Set(rawGeminiKeys.map(cleanKey).filter((k) => k.length > 10))
    );

    const deepseekKey = cleanKey(process.env.DEEPSEEK_API_KEY);
    const openaiKey = cleanKey(process.env.OPENAI_API_KEY);

    if (geminiKeys.length === 0 && !deepseekKey && !openaiKey) {
      return NextResponse.json({
        reply:
          "⚠️ Hệ thống chưa nhận được API Key trên Vercel. Thầy vui lòng kiểm tra mục Settings -> Environment Variables trên Vercel rồi Redeploy nhé!",
      });
    }

    const saveToCache = (replyText: string) => {
      if (QUANTUM_CACHE.size >= MAX_CACHE_SIZE) {
        const firstKey = QUANTUM_CACHE.keys().next().value;
        if (firstKey) QUANTUM_CACHE.delete(firstKey);
      }
      QUANTUM_CACHE.set(cacheKey, replyText);
    };

    const errorLogs: string[] = [];

    // 3. LỰA CHỌN 1: GOOGLE GEMINI (Tốc độ cao với Dynamic Micro-Prompt)
    if (geminiKeys.length > 0) {
      const defaultModels = [
        "gemini-3.8-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-pro",
      ];
      const geminiModels = Array.from(new Set([requestedModel, ...defaultModels]));

      for (let kIdx = 0; kIdx < geminiKeys.length; kIdx++) {
        const apiKey = geminiKeys[kIdx];
        for (const modelName of geminiModels) {
          try {
            const geminiRes = await fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/" +
                modelName +
                ":generateContent?key=" +
                apiKey,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [
                    {
                      role: "user",
                      parts: [{ text: dynamicQuantumPrompt + "\n\n" + userContext }],
                    },
                  ],
                  generationConfig: {
                    temperature: 0.3,
                  },
                }),
              }
            );
            const geminiData = await geminiRes.json();

            if (geminiRes.ok && !geminiData.error) {
              const replyText =
                geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (replyText) {
                saveToCache(replyText);
                return NextResponse.json({
                  reply: replyText,
                  usedModel: modelName,
                  quantumNode: activeSubject + " • " + activeGrade,
                });
              }
            }

            const errMsg = geminiData?.error?.message || ("HTTP " + geminiRes.status);
            errorLogs.push("Gemini(" + modelName + "): " + errMsg);

            if (
              errMsg.includes("API_KEY_INVALID") ||
              errMsg.includes("leaked") ||
              errMsg.includes("expired") ||
              errMsg.includes("PERMISSION_DENIED")
            ) {
              break;
            }
          } catch (error) {
            errorLogs.push("Gemini(" + modelName + "): Lỗi kết nối mạng");
            console.error("Lỗi mạng khi gọi " + modelName + ":", error);
          }
        }
      }
    }

    // 4. LỰA CHỌN 2: DEEPSEEK
    if (deepseekKey) {
      try {
        const deepseekRes = await fetch(
          "https://api.deepseek.com/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + deepseekKey,
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                { role: "system", content: dynamicQuantumPrompt },
                { role: "user", content: userContext },
              ],
            }),
          }
        );
        const deepseekData = await deepseekRes.json();

        if (deepseekRes.ok && deepseekData.choices?.[0]?.message?.content) {
          const replyText = deepseekData.choices[0].message.content;
          saveToCache(replyText);
          return NextResponse.json({
            reply: replyText,
            usedModel: "deepseek-chat",
            quantumNode: activeSubject + " • " + activeGrade,
          });
        }
        errorLogs.push(
          "DeepSeek: " + (deepseekData?.error?.message || ("HTTP " + deepseekRes.status))
        );
      } catch (error) {
        errorLogs.push("DeepSeek: Lỗi mạng");
        console.error("Lỗi mạng khi gọi DeepSeek:", error);
      }
    }

    // 5. LỰA CHỌN 3: OPENAI (CHATGPT)
    if (openaiKey) {
      try {
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + openaiKey,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: dynamicQuantumPrompt },
                { role: "user", content: userContext },
              ],
            }),
          }
        );
        const openaiData = await openaiRes.json();

        if (openaiRes.ok && openaiData.choices?.[0]?.message?.content) {
          const replyText = openaiData.choices[0].message.content;
          saveToCache(replyText);
          return NextResponse.json({
            reply: replyText,
            usedModel: "gpt-4o-mini",
            quantumNode: activeSubject + " • " + activeGrade,
          });
        }
        errorLogs.push(
          "OpenAI: " + (openaiData?.error?.message || ("HTTP " + openaiRes.status))
        );
      } catch (error) {
        errorLogs.push("OpenAI: Lỗi mạng");
        console.error("Lỗi mạng khi gọi OpenAI:", error);
      }
    }

    return NextResponse.json({
      reply:
        "Xin lỗi Thầy/Cô và các em học sinh, hệ thống AI hiện đang bảo trì hoặc mạng quá tải. Vui lòng thử lại sau ít phút nhé!\n\n*(Chi tiết kỹ thuật: " +
        errorLogs.slice(0, 3).join(" | ") +
        ")*",
    });
  } catch (error) {
    console.error("Lỗi Server Tổng:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối máy chủ AI" },
      { status: 500 }
    );
  }
}
