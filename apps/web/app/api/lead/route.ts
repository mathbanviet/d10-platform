import { NextResponse } from "next/server";

// Đường link Google Sheets Web App của Trung tâm Điểm 10⁺
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzGqSyyAKbXUiDAWbbhIrutywmaUOPFVWu1CmhwOcUxa9CKojpgsiD9L63lNFhL1jsA/exec";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Hiển thị trong Terminal khi có người đăng nhập
    console.log("🎓 Người dùng mới đăng nhập:", body);

    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const resultText = await response.text();
    return NextResponse.json({ ok: true, sheetResponse: resultText });
  } catch (error) {
    console.error("Lỗi lưu thông tin vào Google Sheets:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}