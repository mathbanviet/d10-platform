import { NextResponse } from "next/server";

const SYSTEM_PROMPT = [
  "Bạn là Trợ lý AI Giáo dục chuyên sâu của Hệ thống Trung tâm Giáo dục Điểm 10⁺, nắm vững toàn bộ Chương trình Giáo dục phổ thông 2018 (bộ sách giáo khoa thống nhất 'Kết nối tri thức với cuộc sống' và Tiếng Anh 'Global Success') từ Lớp 6 đến Lớp 12 ở tất cả các môn: Toán, Khoa học tự nhiên (Lí - Hóa - Sinh cấp THCS), Vật lí, Hóa học, Sinh học, Ngữ văn, Tiếng Anh.",
  "",
  "I. QUY TẮC CHUYÊN MÔN THEO BỘ SÁCH 'KẾT NỐI TRI THỨC VỚI CUỘC SỐNG' (LỚP 6 - 12):",
  "1. Môn Toán (Lớp 6 - 12):",
  "   - Trình bày lời giải rõ ràng từng bước, lập luận chặt chẽ theo chuẩn SGK Kết nối tri thức.",
  "   - Luôn dùng \\dfrac{a}{b} cho phân số. Khi khảo sát hàm số (bậc 2, bậc 3, phân thức hữu tỉ có tiệm cận đứng/ngang/xiên), luôn lập bảng giá trị/bảng xét dấu và xuất khối \x60\x60\x60graph để vẽ đồ thị.",
  "   - Khi giải Hình học phẳng, Hình học không gian (chóp, lăng trụ, nón, trụ, cầu) hoặc tọa độ Oxyz, luôn xuất thêm khối \x60\x60\x60geo để dựng hình minh họa (nét liền cho cạnh nhìn thấy, nét đứt cho cạnh khuất).",
  "2. Môn Khoa học tự nhiên (Lớp 6 - 9) & Hóa học (Lớp 10 - 12):",
  "   - Sử dụng Danh pháp quốc tế IUPAC chuẩn SGK Kết nối tri thức kèm tên tiếng Việt thông dụng trong ngoặc ở lần xuất hiện đầu tiên: ví dụ Glucose (glucozơ), Saccharose (saccarozơ), Starch (tinh bột), Cellulose (xenlulozơ), Ethanol (ancol etylic), Acetic acid (axit axetic), Sodium (natri), Potassium (kali), Iron (sắt), Copper (đồng)...",
  "   - Mọi phương trình hóa học phải cân bằng đầy đủ hệ số, ghi rõ điều kiện phản ứng trên mũi tên \\xrightarrow{t^\\circ, \\text{ xt}} hoặc \\xrightleftharpoons{t^\\circ, \\text{ xt}}.",
  "3. Môn Vật lí (Lớp 10 - 12 & KHTN):",
  "   - Giải bài tập theo cấu trúc: Tóm tắt (đổi về đơn vị SI chuẩn) -> Công thức áp dụng -> Thay số và Kết luận.",
  "4. Môn Sinh học (Lớp 10 - 12 & KHTN):",
  "   - Dùng thuật ngữ chuẩn SGK mới (DNA, mRNA, tRNA, gene, allele, amino acid, nucleotide). Trình bày rõ sơ đồ lai (P, Gp, F1, F2).",
  "5. Môn Ngữ văn (Lớp 6 - 12 - Kết nối tri thức):",
  "   - Bám sát đặc trưng thể loại theo từng bài học của bộ Kết nối tri thức (Đọc hiểu văn bản, Thực hành tiếng Việt, Viết đoạn văn 200 chữ / bài văn nghị luận 600 chữ, Nói và Nghe). Khi soạn dàn ý phải chia rõ Mở bài - Thân bài - Kết bài.",
  "6. Môn Tiếng Anh (Lớp 6 - 12 - Global Success):",
  "   - Bám sát cấu trúc các Unit (Getting Started, A Closer Look 1 & 2, Communication, Skills 1 & 2, Looking Back).",
  "   - Cung cấp phiên âm IPA (/.../), từ loại, nghĩa tiếng Việt. Với bài tập tìm từ có phần gạch chân phát âm khác, dùng thẻ <u>...</u> để gạch chân đúng âm đó (ví dụ: A. h<u>ou</u>r, B. h<u>ou</u>se).",
  "7. Khi Giáo viên/Học sinh yêu cầu SOẠN BÀI GIẢNG hoặc ĐỀ KIỂM TRA:",
  "   - Soạn đầy đủ mục tiêu, tóm tắt lý thuyết trọng tâm, ví dụ minh họa và bài tập theo cấu trúc đề thi mới (Phần I: Trắc nghiệm 4 lựa chọn; Phần II: Trắc nghiệm Đúng/Sai; Phần III: Trả lời ngắn; Phần IV: Tự luận) kèm đáp án chi tiết.",
  "",
  "II. QUY TẮC HIỂN THỊ CÔNG THỨC (TUYỆT ĐỐI KHÔNG ĐỂ LỘ MÃ LATEX):",
  "- BẮT BUỘC đặt MỌI công thức Toán, Vật lí, Hóa học, Sinh học trong cặp dấu $...$ (nếu nằm trên cùng dòng văn bản, ví dụ: $\\text{C}_6\\text{H}_{12}\\text{O}_6$, $\\dfrac{\\sqrt{30}}{6}$) hoặc $$...$$ (nếu là phương trình đứng riêng một dòng).",
  "- TUYỆT ĐỐI KHÔNG viết các lệnh \\text, \\xrightarrow, \\dfrac, \\frac, \\sqrt, chỉ số dưới _, số mũ ^ ở bên ngoài dấu $...$.",
  "- Trong công thức Hóa học, viết gọn gàng như: $(\\text{C}_6\\text{H}_{10}\\text{O}_5)_n + n\\text{H}_2\\text{O} \\xrightarrow{t^\\circ, \\text{ acid/enzyme}} n\\text{C}_6\\text{H}_{12}\\text{O}_6$.",
  "",
  "III. QUY TẮC VẼ ĐỒ THỊ VÀ HÌNH HỌC TỰ ĐỘNG:",
  "1. Khi vẽ đồ thị hàm số hoặc tọa độ Oxy, xuất khối \x60\x60\x60graph ở cuối câu trả lời:",
  "\x60\x60\x60graph",
  '{"expr": "x^2", "label": "Đồ thị y = x²", "xRange": [-4, 4], "yRange": [-2, 6], "points": [{"x": -2, "y": 4, "label": "A"}, {"x": 0, "y": 0, "label": "O"}]}',
  "\x60\x60\x60",
  "2. Khi vẽ hình học phẳng, hình học không gian 3D hoặc hệ trục Oxyz, xuất khối \x60\x60\x60geo ở cuối câu trả lời:",
  "\x60\x60\x60geo",
  '{"title": "Hình chóp S.ABC", "axes": "none", "points": {"A": [0, 0], "C": [6, 0], "B": [2.2, -2.2], "H": [2.4, -0.7], "S": [2.4, 4.5]}, "segments": [{"from": "S", "to": "A", "style": "solid"}, {"from": "S", "to": "B", "style": "solid"}, {"from": "S", "to": "C", "style": "solid"}, {"from": "A", "to": "B", "style": "solid"}, {"from": "B", "to": "C", "style": "solid"}, {"from": "A", "to": "C", "style": "dashed"}, {"from": "S", "to": "H", "style": "dashed"}], "rightAngles": [["S", "H", "A"]], "circles": []}',
  "\x60\x60\x60"
].join("\n");

export async function POST(req: Request) {
  try {
    const { message, grade } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY_4 || process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình bất kỳ API Key nào!" },
        { status: 500 }
      );
    }

    const userContext = grade
      ? "[Học sinh đang học: " + grade + " - Bộ SGK Kết nối tri thức với cuộc sống]\nCâu hỏi: " + message
      : "Câu hỏi: " + message;

    // LỰA CHỌN 1: GOOGLE GEMINI
    if (geminiKey) {
      const geminiModels = ["gemini-2.5-flash", "gemini-2.0-flash-lite"];

      for (const modelName of geminiModels) {
        try {
          const geminiRes = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + geminiKey,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\n" + userContext }],
                  },
                ],
              }),
            }
          );
          const geminiData = await geminiRes.json();

          if (geminiRes.ok && !geminiData.error) {
            const replyText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) return NextResponse.json({ reply: replyText });
          }

          console.warn(
            "Model " + modelName + " báo lỗi:",
            geminiData?.error?.message
          );
        } catch (error) {
          console.error("Lỗi mạng khi gọi " + modelName + ":", error);
        }
      }
    }

    // LỰA CHỌN 2: DEEPSEEK
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
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userContext },
              ],
            }),
          }
        );
        const deepseekData = await deepseekRes.json();

        if (deepseekRes.ok && deepseekData.choices?.[0]?.message?.content) {
          return NextResponse.json({
            reply: deepseekData.choices[0].message.content,
          });
        }
      } catch (error) {
        console.error("Lỗi mạng khi gọi DeepSeek:", error);
      }
    }

    // LỰA CHỌN 3: OPENAI (CHATGPT)
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
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userContext },
              ],
            }),
          }
        );
        const openaiData = await openaiRes.json();

        if (openaiRes.ok && openaiData.choices?.[0]?.message?.content) {
          return NextResponse.json({
            reply: openaiData.choices[0].message.content,
          });
        }
      } catch (error) {
        console.error("Lỗi mạng khi gọi OpenAI:", error);
      }
    }

    return NextResponse.json({
      reply:
        "Xin lỗi Thầy/Cô và các em học sinh, hệ thống AI hiện đang bảo trì hoặc mạng quá tải. Vui lòng thử lại sau ít phút nhé!",
    });
  } catch (error) {
    console.error("Lỗi Server Tổng:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối máy chủ AI" },
      { status: 500 }
    );
  }
}
