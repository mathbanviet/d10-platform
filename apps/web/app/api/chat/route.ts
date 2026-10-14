import { NextResponse } from "next/server";

// BỘ NHỚ ĐỆM LƯỢNG TỬ TRÊN SERVER (Giúp trả lời tức thì 0.01s nếu trùng câu hỏi tĩnh)
const QUANTUM_CACHE = new Map<string, string>();
const MAX_CACHE_SIZE = 200;

// LÕI ĐỊNH DANH SIÊU NHẸ
const CORE_IDENTITY =
  "Bạn là Trợ lý AI của Hệ thống Giáo dục Điểm 10⁺, chuẩn SGK 'Kết nối tri thức với cuộc sống' (Tiếng Anh 'Global Success'). Trình bày súc tích, rõ ràng từng bước.";

// CÁC VŨ TRỤ MÔN HỌC ĐỘC LẬP
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

  tinhoc: [
    "CHẾ ĐỘ VŨ TRỤ: MÔN TIN HỌC (SGK Kết nối tri thức với cuộc sống - Lớp 6 đến Lớp 12, gồm cả định hướng ICT và CS).",
    "- Lớp 6 - 9 (THCS): Mạng máy tính & Internet, Soạn thảo Word, Bảng tính Excel (địa chỉ tương đối/tuyệt đối $, hàm SUM, AVERAGE, MAX, MIN, COUNTIF, SUMIF, IF), PowerPoint, Sơ đồ khối và Lập trình Scratch.",
    "- Lớp 10 - 12 (THPT): Lập trình Python (if-else, for/while, list, str, def, thuật toán tìm kiếm/sắp xếp), Cơ sở dữ liệu & SQL (SELECT, JOIN, GROUP BY), Trí tuệ nhân tạo (AI), Mạng TCP/IP, Thiết kế web HTML5 & CSS3.",
    "- Khi viết mã nguồn (Python, SQL, HTML, CSS, công thức Excel), BẮT BUỘC đặt trong khối \x60\x60\x60python, \x60\x60\x60sql, \x60\x60\x60html, \x60\x60\x60css kèm giải thích từng dòng lệnh."
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

  giaosu: [
    "CHẾ ĐỘ VŨ TRỤ TỐI THƯỢNG: GIÁO SƯ ĐA VŨ TRỤ (IQ VÔ CỰC - KẾT NỐI DỮ LIỆU THỜI GIAN THỰC).",
    "- Giải đáp mọi câu hỏi ở mọi trình độ (Phổ thông, Chuyên/HSG Quốc gia, Olympic Quốc tế IMO/IPhO/IChO/IBO/IOI, Đại học, Thạc sĩ, Tiến sĩ, Nghiên cứu hàn lâm).",
    "- Bao quát mọi lĩnh vực: Toán cao cấp, Vật lí lượng tử, Hóa học, Y - Sinh học, Khoa học Máy tính & AI, Kinh tế - Tài chính - Chứng khoán - Bất động sản, Triết học, Luật học, Lịch sử, Văn học, Nghệ thuật, Ngôn ngữ học...",
    "- QUAN TRỌNG VỀ DỮ LIỆU THỜI GIAN THỰC: Khi trong đề bài có kèm mục [DỮ LIỆU TRỰC TUYẾN THỜI GIAN THỰC TỪ INTERNET / SÀN CHỨNG KHOÁN], bạn BẮT BUỘC sử dụng chính xác các con số đó để trả lời trực tiếp, lập bảng phân tích chi tiết (giá hiện tại, biên độ dao động, khối lượng, xu hướng) như một Giáo sư Tài chính thực thụ. TUYỆT ĐỐI KHÔNG nói câu 'tôi không thể truy cập dữ liệu thời gian thực' khi đã được cung cấp dữ liệu!",
    "- Đặt mọi công thức Toán/Lý/Hóa trong cặp dấu $...$ hoặc $$...$$ (dùng \\dfrac{a}{b} cho phân số)."
  ].join("\n"),
};

// RÀO CHẮN KIẾN THỨC THEO KHỐI LỚP
const GRADE_CONSTRAINTS: Record<string, string> = {
  "Lớp 6": "TỌA ĐỘ LỚP 6: Chỉ dùng kiến thức Lớp 6 chuẩn SGK Kết nối tri thức. Tuyệt đối chưa dùng kiến thức lớp trên.",
  "Lớp 7": "TỌA ĐỘ LỚP 7: Dùng kiến thức Lớp 7 chuẩn SGK Kết nối tri thức.",
  "Lớp 8": "TỌA ĐỘ LỚP 8: Dùng kiến thức Lớp 8 chuẩn SGK Kết nối tri thức.",
  "Lớp 9": "TỌA ĐỘ LỚP 9 (Ôn thi vào 10): Dùng kiến thức Lớp 9 chuẩn SGK Kết nối tri thức.",
  "Lớp 10": "TỌA ĐỘ LỚP 10: Dùng kiến thức Lớp 10 chuẩn SGK Kết nối tri thức.",
  "Lớp 11": "TỌA ĐỘ LỚP 11: Dùng kiến thức Lớp 11 chuẩn SGK Kết nối tri thức.",
  "Lớp 12": "TỌA ĐỘ LỚP 12 (Ôn thi Tốt nghiệp THPT & ĐGNL): Dùng kiến thức Lớp 12 chuẩn SGK Kết nối tri thức.",
  "Giáo sư": "TỌA ĐỘ ĐẶC BIỆT - CẤP ĐỘ GIÁO SƯ (IQ VÔ CỰC - ĐỈNH CAO TRÍ TUỆ NHÂN LOẠI): Bạn là vị Giáo sư lỗi lạc bậc nhất thế giới với IQ vô cực, kết nối trực tiếp với kho dữ liệu thời gian thực toàn cầu. Giải quyết trọn vẹn mọi bài toán hóc búa nhất, phân tích tài chính, chứng khoán, kinh tế, khoa học công nghệ với số liệu thực tế chính xác."
};

function detectSubjectNode(msg: string, selectedSubject?: string, selectedGrade?: string): string {
  if (selectedSubject && selectedSubject !== "auto" && SUBJECT_QUANTUM_NODES[selectedSubject]) {
    return selectedSubject;
  }
  if (selectedGrade && selectedGrade.includes("Giáo sư")) {
    return "giaosu";
  }
  const lower = msg.toLowerCase();
  if (/\b(cổ phiếu|chứng khoán|vnindex|vn-index|hose|hnx|upcom|tỷ giá|giá vàng|bitcoin|crypto|vĩ mô|lãi suất|gdp)\b/.test(lower)) {
    return "giaosu";
  }
  if (/\b(tin học|lập trình|python|scratch|excel|bảng tính|cơ sở dữ liệu|sql|html|css|trang web|thuật toán|mạng máy tính|word|powerpoint|sumif|countif|vlookup|xlookup|sơ đồ khối)\b/.test(lower)) {
    return "tinhoc";
  }
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

// Kiểm tra xem câu hỏi có cần tra cứu dữ liệu thời gian thực trên Internet / Sàn chứng khoán hay không
function needsRealtimeWebData(msg: string): boolean {
  const lower = msg.toLowerCase();
  return /\b(hôm nay|hiện tại|bây giờ|mới nhất|năm nay|2025|2026|giá|cổ phiếu|chứng khoán|vnindex|vn-index|vn30|tỷ giá|ngoại tệ|usd|vàng|sjc|bitcoin|btc|eth|thời tiết|tin tức| sự kiện|ai là|tổng thống|thủ tướng|bộ trưởng|kết quả|bảng xếp hạng)\b/.test(
    lower
  );
}

// Trích xuất mã cổ phiếu từ câu hỏi (ví dụ: "Giá cổ phiếu FPT hôm nay" -> ["FPT"])
function extractStockSymbols(msg: string): string[] {
  const stopWords = new Set([
    "GIA", "HOM", "NAY", "BAO", "NHIEU", "CUA", "TREN", "SAN", "HOSE", "HNX",
    "UPCOM", "THE", "NAO", "CHO", "HOI", "XEM", "TIN", "TUC", "VOI", "CAC",
    "MUA", "BAN", "NEN", "DAU", "KHI", "anh", "CHI", "THAY", "GIAO", "LOP",
    "USD", "VND", "SJC", "GDP", "CPI", "FED", "AI", "IOT", "SQL", "CSS"
  ]);
  const symbols: string[] = [];

  // Bắt mã đứng sau chữ "cổ phiếu", "mã", "cp"
  const afterKeyword = msg.match(/(?:cổ phiếu|co phieu|mã|cp)\s+([A-Za-z0-9]{3,5})\b/gi);
  if (afterKeyword) {
    afterKeyword.forEach((m) => {
      const parts = m.trim().split(/\s+/);
      const code = (parts[parts.length - 1] || "").toUpperCase();
      if (code.length >= 3 && !stopWords.has(code)) {
        symbols.push(code);
      }
    });
  }

  // Bắt các từ viết hoa 3 chữ cái (ví dụ: FPT, VCB, HPG, VIC, VNM, SSI, MWG...)
  const upperMatches = msg.match(/\b[A-Z][A-Z0-9]{2,3}\b/g);
  if (upperMatches) {
    upperMatches.forEach((code) => {
      if (!stopWords.has(code) && !symbols.includes(code)) {
        symbols.push(code);
      }
    });
  }

  if (/vn-?index/i.test(msg) && !symbols.includes("^VNINDEX")) {
    symbols.push("^VNINDEX");
  }

  return symbols.slice(0, 3);
}

// 1. RADAR TRA CỨU GIÁ CỔ PHIẾU TRỰC TIẾP (Yahoo Finance & VNDirect Realtime Feed)
async function fetchLiveStockQuote(symbol: string): Promise<string> {
  const cleanSym = symbol.toUpperCase();
  const yahooTickers =
    cleanSym === "^VNINDEX"
      ? ["^VNINDEX"]
      : [cleanSym + ".VN", cleanSym];

  // Thử nguồn 1: Yahoo Finance Live Chart API (Hỗ trợ cả cổ phiếu VN như FPT.VN, VCB.VN và Quốc tế như AAPL, NVDA)
  for (const ticker of yahooTickers) {
    try {
      const url =
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
        encodeURIComponent(ticker) +
        "?interval=1d&range=5d";
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        const meta = result?.meta;
        if (meta && typeof meta.regularMarketPrice === "number") {
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose || meta.previousClose || price;
          const change = price - prevClose;
          const changePct = prevClose ? ((change / prevClose) * 100).toFixed(2) : "0.00";
          const high = meta.regularMarketDayHigh ?? price;
          const low = meta.regularMarketDayLow ?? price;
          const volume = meta.regularMarketVolume ?? 0;
          const currency = meta.currency || (ticker.endsWith(".VN") ? "VND" : "USD");
          const marketTime = meta.regularMarketTime
            ? new Date(meta.regularMarketTime * 1000).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })
            : new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

          const fmtPrice = (v: number) =>
            currency === "VND" ? v.toLocaleString("vi-VN") + " VNĐ" : v.toLocaleString("en-US") + " " + currency;

          return [
            "📈 DỮ LIỆU BẢNG ĐIỆN TỬ TRỰC TIẾP MÃ " + cleanSym + " (" + ticker + "):",
            "- Giá khớp lệnh hiện tại: " + fmtPrice(price) + " (" + (change >= 0 ? "+" : "") + change.toLocaleString("vi-VN") + " / " + (change >= 0 ? "+" : "") + changePct + "%)",
            "- Giá tham chiếu (đóng cửa phiên trước): " + fmtPrice(prevClose),
            "- Biên độ trong phiên: Thấp nhất " + fmtPrice(low) + " - Cao nhất " + fmtPrice(high),
            "- Khối lượng giao dịch: " + Number(volume).toLocaleString("vi-VN") + " cổ phiếu",
            "- Thời gian cập nhật sàn: " + marketTime,
          ].join("\n");
        }
      }
    } catch {
      // Chuyển sang nguồn tiếp theo nếu lỗi
    }
  }

  // Thử nguồn 2: VNDirect DChart Realtime API (Dự phòng chuyên biệt cho sàn HOSE/HNX/UPCOM Việt Nam)
  try {
    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec = nowSec - 7 * 86400;
    const vndUrl =
      "https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol=" +
      encodeURIComponent(cleanSym) +
      "&from=" +
      fromSec +
      "&to=" +
      nowSec;
    const vndRes = await fetch(vndUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (vndRes.ok) {
      const vndData = await vndRes.json();
      if (vndData?.s === "ok" && Array.isArray(vndData.c) && vndData.c.length > 0) {
        const lastIdx = vndData.c.length - 1;
        const closePrice = Number(vndData.c[lastIdx]) * 1000;
        const prevPrice =
          lastIdx > 0 ? Number(vndData.c[lastIdx - 1]) * 1000 : Number(vndData.o[lastIdx]) * 1000;
        const highPrice = Number(vndData.h[lastIdx]) * 1000;
        const lowPrice = Number(vndData.l[lastIdx]) * 1000;
        const vol = Number(vndData.v[lastIdx]);
        const diff = closePrice - prevPrice;
        const pct = prevPrice ? ((diff / prevPrice) * 100).toFixed(2) : "0.00";

        return [
          "📈 DỮ LIỆU SÀN CHỨNG KHOÁN VIỆT NAM (VNDIRECT) MÃ " + cleanSym + ":",
          "- Thị giá hiện tại: " + closePrice.toLocaleString("vi-VN") + " VNĐ/cổ phiếu (" + (diff >= 0 ? "+" : "") + diff.toLocaleString("vi-VN") + " VNĐ / " + (diff >= 0 ? "+" : "") + pct + "%)",
          "- Cao nhất phiên: " + highPrice.toLocaleString("vi-VN") + " VNĐ | Thấp nhất phiên: " + lowPrice.toLocaleString("vi-VN") + " VNĐ",
          "- Khối lượng khớp lệnh: " + vol.toLocaleString("vi-VN") + " cổ phiếu",
        ].join("\n");
      }
    }
  } catch {
    // Bỏ qua nếu lỗi
  }

  return "";
}

// 2. RADAR TRA CỨU TIN TỨC & WEB THỜI GIAN THỰC (Google News RSS Vietnam)
async function fetchLiveWebSearch(query: string): Promise<string> {
  try {
    const rssUrl =
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(query) +
      "&hl=vi&gl=VN&ceid=VN:vi";
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return "";
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const snippets: string[] = [];

    for (const item of items.slice(0, 5)) {
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      if (titleMatch && titleMatch[1]) {
        const cleanTitle = titleMatch[1]
          .replace(/<!\[CDATA\[|\]\]>/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .trim();
        const dateStr = pubDateMatch && pubDateMatch[1] ? " (" + pubDateMatch[1].trim() + ")" : "";
        snippets.push("• " + cleanTitle + dateStr);
      }
    }

    if (snippets.length > 0) {
      return "🌐 CẬP NHẬT TIN TỨC MỚI NHẤT TRÊN BÁO CHÍ VIỆT NAM:\n" + snippets.join("\n");
    }
  } catch {
    // Bỏ qua nếu lỗi mạng
  }
  return "";
}

// Tổng hợp dữ liệu trực tuyến từ Sàn chứng khoán + Báo chí
async function buildRealtimeContext(msg: string): Promise<string> {
  const tasks: Promise<string>[] = [];

  if (/\b(cổ phiếu|co phieu|chứng khoán|chung khoan|mã|vnindex|vn-index|hose|hnx|upcom|fpt|vcb|hpg|vic|vnm|ssi|mwg|tcb|mbb)\b/i.test(msg)) {
    const symbols = extractStockSymbols(msg);
    for (const sym of symbols) {
      tasks.push(fetchLiveStockQuote(sym));
    }
  }

  if (needsRealtimeWebData(msg)) {
    tasks.push(fetchLiveWebSearch(msg));
  }

  if (tasks.length === 0) return "";

  const results = (await Promise.all(tasks)).filter((r) => r && r.trim().length > 0);
  if (results.length === 0) return "";

  const nowVN = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  return (
    "\n\n[DỮ LIỆU TRỰC TUYẾN THỜI GIAN THỰC TỪ INTERNET / SÀN CHỨNG KHOÁN LÚC " +
    nowVN +
    "]:\n" +
    results.join("\n\n") +
    "\n(Hãy sử dụng trực tiếp các số liệu thời gian thực ở trên để trả lời chi tiết và chính xác cho người dùng)."
  );
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

    const activeSubject = detectSubjectNode(cleanMsg, subject, grade);
    const activeGrade = String(grade || "Lớp 9").trim();
    const requestedModel =
      typeof model === "string" && model.trim() ? model.trim() : "gemini-3.8-flash";
    const isRealtimeQuery = needsRealtimeWebData(cleanMsg);

    // 1. KIỂM TRA BỘ NHỚ ĐỆM LƯỢNG TỬ (Không dùng cache cũ nếu là câu hỏi giá cổ phiếu/thời gian thực)
    const cacheKey =
      activeSubject + "|" + activeGrade + "|" + requestedModel + "|" + cleanMsg.toLowerCase();
    if (!isRealtimeQuery) {
      const cachedReply = QUANTUM_CACHE.get(cacheKey);
      if (cachedReply) {
        return NextResponse.json({
          reply: cachedReply,
          usedModel: requestedModel + " (Quantum Cache ⚡)",
          quantumNode: activeSubject + " • " + activeGrade,
        });
      }
    }

    // 2. TRA CỨU DỮ LIỆU THỜI GIAN THỰC (Chứng khoán / Tin tức mới nhất) NẾU CẦN
    const realtimeDataBlock = await buildRealtimeContext(cleanMsg);

    // 3. THU GỌN HÀM SÓNG: Chỉ ghép đúng Nút Môn học + Nút Khối lớp
    const subjectPrompt = SUBJECT_QUANTUM_NODES[activeSubject] || SUBJECT_QUANTUM_NODES.toan;
    const gradeKey = Object.keys(GRADE_CONSTRAINTS).find((k) => activeGrade.includes(k)) || "";
    const gradePrompt = gradeKey ? GRADE_CONSTRAINTS[gradeKey] : "TỌA ĐỘ LỚP: " + activeGrade;

    const dynamicQuantumPrompt = [
      CORE_IDENTITY,
      subjectPrompt,
      gradePrompt,
    ].join("\n\n");

    const userContext =
      "[Tọa độ Lưới: " +
      activeGrade +
      " | Môn: " +
      activeSubject.toUpperCase() +
      "]\nCâu hỏi: " +
      cleanMsg +
      realtimeDataBlock;

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
      if (isRealtimeQuery) return;
      if (QUANTUM_CACHE.size >= MAX_CACHE_SIZE) {
        const firstKey = QUANTUM_CACHE.keys().next().value;
        if (firstKey) QUANTUM_CACHE.delete(firstKey);
      }
      QUANTUM_CACHE.set(cacheKey, replyText);
    };

    const errorLogs: string[] = [];

    // 4. LỰA CHỌN 1: GOOGLE GEMINI (Tích hợp Google Search Grounding + Radar Chứng khoán trực tiếp)
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
          // Nếu câu hỏi cần tra cứu web thực tế mà chưa lấy được từ Radar riêng, thử bật công cụ google_search của Gemini trước
          const attemptConfigs =
            isRealtimeQuery && !realtimeDataBlock
              ? [true, false]
              : [false];

          for (const useGoogleSearchTool of attemptConfigs) {
            try {
              const payload: Record<string, unknown> = {
                contents: [
                  {
                    role: "user",
                    parts: [{ text: dynamicQuantumPrompt + "\n\n" + userContext }],
                  },
                ],
                generationConfig: {
                  temperature: 0.3,
                },
              };

              if (useGoogleSearchTool) {
                payload.tools = [{ google_search: {} }];
              }

              const geminiRes = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/" +
                  modelName +
                  ":generateContent?key=" +
                  apiKey,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );
              const geminiData = await geminiRes.json();

              if (geminiRes.ok && !geminiData.error) {
                const parts = geminiData?.candidates?.[0]?.content?.parts || [];
                const replyText = parts
                  .map((p: { text?: string }) => p.text || "")
                  .join("");
                if (replyText) {
                  saveToCache(replyText);
                  return NextResponse.json({
                    reply: replyText,
                    usedModel:
                      modelName +
                      (realtimeDataBlock || useGoogleSearchTool ? " 🌐 Live Web" : ""),
                    quantumNode: activeSubject + " • " + activeGrade,
                  });
                }
              }

              const errMsg =
                geminiData?.error?.message || ("HTTP " + geminiRes.status);
              if (!useGoogleSearchTool) {
                errorLogs.push("Gemini(" + modelName + "): " + errMsg);
              }

              if (
                errMsg.includes("API_KEY_INVALID") ||
                errMsg.includes("leaked") ||
                errMsg.includes("expired") ||
                errMsg.includes("PERMISSION_DENIED")
              ) {
                kIdx = geminiKeys.length; // Chuyển sang key khác
                break;
              }
            } catch (error) {
              if (!useGoogleSearchTool) {
                errorLogs.push("Gemini(" + modelName + "): Lỗi kết nối mạng");
              }
              console.error("Lỗi mạng khi gọi " + modelName + ":", error);
            }
          }
        }
      }
    }

    // 5. LỰA CHỌN 2: DEEPSEEK
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
            usedModel: "deepseek-chat" + (realtimeDataBlock ? " 🌐 Live Web" : ""),
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

    // 6. LỰA CHỌN 3: OPENAI (CHATGPT)
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
            usedModel: "gpt-4o-mini" + (realtimeDataBlock ? " 🌐 Live Web" : ""),
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
