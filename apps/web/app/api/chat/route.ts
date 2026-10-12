import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình GEMINI_API_KEY' },
        { status: 500 }
      );
    }

    // Gọi API bằng khóa chuẩn AIzaSy... thông qua query ?key=
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Bạn là trợ lý AI thông minh của Hệ thống Trung tâm Giáo dục Điểm 10+. Hãy trả lời ngắn gọn, thân thiện, chính xác theo chương trình GDPT 2018 của Việt Nam. Câu hỏi của người dùng: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json(
        { reply: `Xin lỗi Thầy, Google API báo lỗi: ${data?.error?.message || 'Kiểm tra lại khóa API'}` },
        { status: 200 }
      );
    }

    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, em chưa thể trả lời câu hỏi này lúc này.';

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: 'Lỗi kết nối máy chủ AI' },
      { status: 500 }
    );
  }
}