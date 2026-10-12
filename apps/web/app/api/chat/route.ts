import { NextResponse } from 'next/server';

// Định nghĩa System Prompt chuẩn cho toàn bộ các AI
const SYSTEM_PROMPT = "Bạn là trợ lý AI thông minh của Hệ thống Trung tâm Giáo dục Điểm 10+. Hãy trả lời ngắn gọn, thân thiện, chính xác theo chương trình GDPT 2018 của Việt Nam.";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Lấy các khóa API từ biến môi trường Vercel
    const geminiKey = process.env.GEMINI_API_KEY_4; // Khóa hiện tại Thầy đang dùng
    const deepseekKey = process.env.DEEPSEEK_API_KEY; // Thêm vào Vercel sau
    const openaiKey = process.env.OPENAI_API_KEY;     // Thêm vào Vercel sau

    if (!geminiKey && !deepseekKey && !openaiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình bất kỳ API Key nào!' },
        { status: 500 }
      );
    }

    // ==========================================
    // LỰA CHỌN 1: GỌI GOOGLE GEMINI (Miễn phí)
    // ==========================================
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT} Câu hỏi: ${message}` }] }],
            }),
          }
        );
        const geminiData = await geminiRes.json();

        // Nếu Gemini trả về thành công và không có lỗi (không bị High Demand)
        if (geminiRes.ok && !geminiData.error) {
          const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return NextResponse.json({ reply: replyText });
        }
        
        console.warn("⚠️ Gemini quá tải hoặc lỗi, kích hoạt chuyển hướng sang DeepSeek/ChatGPT...");
      } catch (error) {
        console.error("Lỗi mạng khi gọi Gemini, chuyển hướng...", error);
      }
    }

    // ==========================================
    // LỰA CHỌN 2: FALLBACK SANG DEEPSEEK (Chuyên Toán/Lập trình, Giá siêu rẻ)
    // ==========================================
    if (deepseekKey) {
      try {
        const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message }
            ]
          })
        });
        const deepseekData = await deepseekRes.json();

        if (deepseekRes.ok && deepseekData.choices?.[0]?.message?.content) {
          return NextResponse.json({ reply: deepseekData.choices[0].message.content });
        }
        console.warn("⚠️ DeepSeek phản hồi lỗi, kích hoạt chuyển hướng sang OpenAI...");
      } catch (error) {
        console.error("Lỗi mạng khi gọi DeepSeek, chuyển hướng...", error);
      }
    }

    // ==========================================
    // LỰA CHỌN 3: FALLBACK SANG CHATGPT (Ổn định tuyệt đối)
    // ==========================================
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message }
            ]
          })
        });
        const openaiData = await openaiRes.json();

     if (openaiRes.ok && openaiData.choices?.[0]?.message?.content) {
          return NextResponse.json({ reply: openaiData.choices[0].message.content });
        }
      } catch (error) {
        console.error("Lỗi mạng khi gọi OpenAI...", error);
      }
    }

    // ==========================================
    // NẾU CẢ 3 AI ĐỀU THẤT BẠI HOẶC CHƯA CÓ API KEY PHỤ
    // ==========================================
    return NextResponse.json({ 
      reply: 'Xin lỗi Thầy và các em học sinh, hệ thống AI hiện đang bảo trì hoặc mạng quá tải. Vui lòng thử lại sau ít phút nhé!' 
    });

  } catch (error) {
    console.error("Lỗi Server Tổng:", error);
    return NextResponse.json(
      { error: 'Lỗi kết nối máy chủ AI' },
      { status: 500 }
    );
  }
}