import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = "Bạn là trợ lý AI thông minh của Hệ thống Trung tâm Giáo dục Điểm 10+. Hãy trả lời ngắn gọn, thân thiện, chính xác theo chương trình GDPT 2018 của Việt Nam.";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const geminiKey = process.env.GEMINI_API_KEY_4 || process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình bất kỳ API Key nào!' },
        { status: 500 }
      );
    }

    // ==========================================
    // LỰA CHỌN 1: GỌI GOOGLE GEMINI (Miễn phí)
    // Thử lần lượt gemini-3.8-flash và dự phòng gemini-3.5-flash-lite
    // ==========================================
    if (geminiKey) {
      const geminiModels = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];

      for (const modelName of geminiModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT} Câu hỏi: ${message}` }] }],
              }),
            }
          );
          const geminiData = await geminiRes.json();

          if (geminiRes.ok && !geminiData.error) {
            const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) return NextResponse.json({ reply: replyText });
          }

          console.warn(`⚠️ Model ${modelName} báo lỗi:`, geminiData?.error?.message);
        } catch (error) {
          console.error(`Lỗi mạng khi gọi ${modelName}:`, error);
        }
      }
    }

    // ==========================================
    // LỰA CHỌN 2: FALLBACK SANG DEEPSEEK
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
        console.warn("⚠️ DeepSeek báo lỗi:", deepseekData?.error?.message || deepseekData);
      } catch (error) {
        console.error("Lỗi mạng khi gọi DeepSeek:", error);
      }
    }

    // ==========================================
    // LỰA CHỌN 3: FALLBACK SANG CHATGPT (OpenAI)
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
        console.warn("⚠️ OpenAI báo lỗi:", openaiData?.error?.message || openaiData);
      } catch (error) {
        console.error("Lỗi mạng khi gọi OpenAI:", error);
      }
    }

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