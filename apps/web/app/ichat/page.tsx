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

interface GraphSegment {
  from: [number, number];
  to: [number, number];
  style?: "solid" | "dashed";
  vector?: boolean;
  label?: string;
}

interface GraphCircle {
  x: number;
  y: number;
  r: number;
  style?: "solid" | "dashed";
}

interface GraphConfig {
  expr?: string;
  exprs?: string[];
  label?: string;
  labels?: string[];
  xRange?: [number, number];
  yRange?: [number, number];
  points?: GraphPoint[];
  segments?: GraphSegment[];
  circles?: GraphCircle[];
}

interface GeoSegment {
  from: string;
  to: string;
  style?: "solid" | "dashed";
  vector?: boolean;
  label?: string;
}

interface GeoCircle {
  center: string;
  r: number;
  ry?: number;
  style?: "solid" | "dashed";
}

interface GeoConfig {
  title?: string;
  axes?: "none" | "Oxy" | "Oxyz";
  points: Record<string, number[]>;
  segments?: GeoSegment[];
  circles?: GeoCircle[];
  rightAngles?: [string, string, string][];
}

declare global {
  interface Window {
    katex?: {
      renderToString: (
        tex: string,
        options?: {
          displayMode?: boolean;
          throwOnError?: boolean;
          strict?: boolean | string;
          trust?: boolean;
        }
      ) => string;
    };
  }
}

interface MessageMeta {
  sender: "user" | "ai";
  text: string;
  nodeInfo?: string;
  latencyMs?: number;
}

const SUBJECT_NODES = [
  { id: "auto", label: "🌐 Tự động", color: "from-indigo-600 to-blue-600" },
  { id: "toan", label: "📐 Toán", color: "from-blue-600 to-cyan-600" },
  { id: "vatli", label: "⚡ Vật lí", color: "from-amber-500 to-orange-600" },
  { id: "hoahoc", label: "🧪 Hóa học", color: "from-emerald-600 to-teal-600" },
  { id: "sinhhoc", label: "🧬 Sinh học", color: "from-green-600 to-lime-600" },
  { id: "khtn", label: "🔬 KHTN (6-9)", color: "from-purple-600 to-indigo-600" },
  { id: "tinhoc", label: "💻 Tin học", color: "from-cyan-600 to-blue-700" },
  { id: "nguvan", label: "📖 Ngữ văn", color: "from-rose-600 to-pink-600" },
  { id: "tienganh", label: "🇬🇧 Tiếng Anh", color: "from-sky-600 to-blue-700" },
];

const GRADE_LIST = [
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
  "Giáo sư",
];

// MA TRẬN GỢI Ý LƯỢNG TỬ THEO TỪNG MÔN & KHỐI LỚP (Bộ SGK Kết nối tri thức)
const QUANTUM_PROMPTS_MATRIX: Record<string, Record<string, string[]>> = {
  toan: {
    "Lớp 6": [
      "Tóm tắt lý thuyết và ví dụ bài Ước chung và Ước chung lớn nhất Toán 6 KNTT",
      "Tìm ƯCLN và BCNN của 24, 36 và 60 có trình bày từng bước",
      "Giải bài tập quy tắc dấu ngoặc và phép cộng trừ số nguyên Toán 6",
    ],
    "Lớp 7": [
      "Lý thuyết và bài tập Áp dụng tính chất dãy tỉ số bằng nhau Toán 7 KNTT",
      "Chứng minh hai tam giác bằng nhau theo trường hợp cạnh - góc - cạnh",
      "Thu gọn và tìm nghiệm của đa thức một biến P(x) = 2x^2 - 5x + 3",
    ],
    "Lớp 8": [
      "7 hằng đẳng thức đáng nhớ và bài tập phân tích đa thức thành nhân tử Toán 8",
      "Áp dụng định lí Thalès tính độ dài đoạn thẳng trong tam giác kèm hình vẽ",
      "Vẽ đồ thị hàm số bậc nhất y = 2x - 3 trên mặt phẳng tọa độ Oxy",
    ],
    "Lớp 9": [
      "Khảo sát và vẽ đồ thị parabol y = x^2 và đường thẳng y = x + 2 trên cùng Oxy",
      "Ứng dụng hệ thức Viète tìm tham số m trong phương trình bậc hai Toán 9",
      "Bài tập tiếp tuyến của đường tròn và tứ giác nội tiếp ôn thi vào 10",
    ],
    "Lớp 10": [
      "Khảo sát và vẽ đồ thị hàm số bậc hai y = x^2 - 4x + 3 Toán 10 KNTT",
      "Giải tam giác bằng định lí Cosin và định lí Sin kèm hình minh họa",
      "Viết phương trình tổng quát và tham số của đường thẳng trong mặt phẳng Oxy",
    ],
    "Lớp 11": [
      "Tính giới hạn của dãy số và hàm số bằng quy tắc liên hợp Toán 11 KNTT",
      "Chứng minh đường thẳng vuông góc với mặt phẳng trong hình chóp S.ABC kèm hình 3D",
      "Giải phương trình mũ và lôgarit cơ bản Toán 11 Kết nối tri thức",
    ],
    "Lớp 12": [
      "Khảo sát sự biến thiên và vẽ đồ thị hàm số y = x^3 - 3x + 1 Toán 12 KNTT",
      "Tìm tiệm cận đứng và tiệm cận xiên của hàm số y = (x^2 + x - 1)/(x - 1)",
      "Bài tập công thức xác suất toàn phần và công thức Bayes Toán 12 KNTT",
    ],
    "Giáo sư": [
      "Giáo sư Toán học: Giải phương trình hàm Olympic Quốc tế (IMO) và phân tích bản chất",
      "Giáo sư Toán cao cấp: Bản chất hình học của Giá trị riêng, Vectơ riêng và Chuỗi Fourier",
      "Giáo sư Toán ứng dụng: Mô hình phương trình vi phân ngẫu nhiên Black-Scholes trong tài chính",
    ],
  },
  hoahoc: {
    "Lớp 6": ["Phân biệt chất tinh khiết và hỗn hợp đồng nhất, không đồng nhất KHTN 6"],
    "Lớp 7": ["Cấu tạo nguyên tử, bảng tuần hoàn các nguyên tố hóa học và hóa trị KHTN 7"],
    "Lớp 8": [
      "Cách tính số mol, nồng độ phần trăm (C%) và nồng độ mol (CM) KHTN 8",
      "Phân loại và gọi tên Oxide, Acid, Base, Muối theo danh pháp IUPAC chuẩn KNTT",
    ],
    "Lớp 9": [
      "Tính chất hóa học của kim loại, dãy hoạt động hóa học KHTN 9 KNTT",
      "Viết phương trình phản ứng của Ethanol và Acetic acid (tráng bạc, ester hóa)",
    ],
    "Lớp 10": [
      "Cách cân bằng phương trình phản ứng oxi hóa - khử bằng phương pháp thăng bằng electron",
      "Ý nghĩa và cách tính biến thiên enthalpy chuẩn của phản ứng hóa học Hóa 10 KNTT",
    ],
    "Lớp 11": [
      "Khái niệm cân bằng hóa học, hằng số cân bằng Kc và nguyên lí Le Chatelier Hóa 11",
      "Danh pháp thay thế và phản ứng thế halogen của Alkane, cộng vào Alkene Hóa 11 KNTT",
    ],
    "Lớp 12": [
      "Viết phương trình thủy phân tinh bột (Starch) và Cellulose thành Glucose Hóa 12 KNTT",
      "Phản ứng xà phòng hóa Ester và cấu tạo chất giặt rửa tổng hợp Hóa 12 KNTT",
      "Cấu tạo, suất điện động chuẩn của Pin điện hóa Galvani Zn - Cu Hóa 12 KNTT",
    ],
    "Giáo sư": [
      "Giáo sư Hóa học: Cơ chế phản ứng hữu cơ nâng cao (SN1, SN2, E1, E2) và thuyết Orbital phân tử (MO)",
      "Giáo sư Hóa lý: Nhiệt động lực học thống kê, năng lượng tự do Gibbs và động học xúc tác dị thể",
      "Giáo sư Hóa sinh: Tổng hợp toàn phần hợp chất thiên nhiên và thiết kế thuốc phân tử đích",
    ],
  },
  vatli: {
    "Lớp 10": [
      "Ba định luật Newton về chuyển động và bài tập phân tích lực Vật lí 10 KNTT",
      "Định luật bảo toàn cơ năng (động năng và thế năng trọng trường) Vật lí 10",
    ],
    "Lớp 11": [
      "Phương trình dao động điều hòa x = A cos(omega*t + phi) và cách tính vận tốc cực đại",
      "Định luật Coulomb và cường độ điện trường của điện tích điểm Vật lí 11 KNTT",
    ],
    "Lớp 12": [
      "Định luật I Nhiệt động lực học (Delta U = A + Q) và quy ước dấu Vật lí 12 KNTT",
      "Phương trình trạng thái khí lí tưởng pV = nRT và các đẳng quá trình Vật lí 12",
      "Cảm ứng từ, từ thông và định luật Faraday về cảm ứng điện từ Vật lí 12 KNTT",
    ],
    "Giáo sư": [
      "Giáo sư Vật lí lượng tử: Phương trình Schrödinger, nguyên lý bất định Heisenberg và vướng víu lượng tử",
      "Giáo sư Vũ trụ học: Thuyết tương đối rộng của Einstein, lỗ đen và bức xạ Hawking",
      "Giáo sư Vật lí Olympic (IPhO): Cơ học giải tích Lagrange - Hamilton và điện động lực học Maxwell",
    ],
  },
  sinhhoc: {
    "Lớp 10": [
      "Cấu trúc không gian của phân tử DNA và bài tập tính số liên kết Hydrogen (H = 2A + 3G)",
      "So sánh quá trình nguyên phân và giảm phân Sinh học 10 Kết nối tri thức",
    ],
    "Lớp 11": [
      "Quá trình quang hợp ở thực vật C3, C4 và CAM Sinh học 11 Kết nối tri thức",
      "Cơ chế truyền tin qua synapse và cung phản xạ ở động vật Sinh học 11",
    ],
    "Lớp 12": [
      "Cơ chế tái bản DNA, phiên mã tạo mRNA và dịch mã tổng hợp chuỗi polypeptide Sinh 12",
      "Giải bài tập quy luật phân li độc lập của Mendel và hoán vị gene Sinh 12 KNTT",
      "Cấu trúc di truyền của quần thể ngẫu phối và định luật Hardy - Weinberg",
    ],
    "Giáo sư": [
      "Giáo sư Y Sinh & Di truyền: Công nghệ chỉnh sửa gene CRISPR-Cas9 và liệu pháp miễn dịch tế bào CAR-T",
      "Giáo sư Sinh học phân tử (IBO): Cơ chế điều hòa biểu hiện gene Epigenetics và gấp cuộn protein",
      "Giáo sư Thần kinh học: Cơ chế dẫn truyền điện thế hoạt động và mạng lưới nơ-ron não bộ",
    ],
  },
  khtn: {
    "Lớp 6": [
      "Cấu tạo tế bào nhân sơ, tế bào nhân thực và 5 giới sinh vật KHTN 6 KNTT",
      "Lực tiếp xúc, lực không tiếp xúc, trọng lực và khối lượng KHTN 6 KNTT",
    ],
    "Lớp 7": [
      "Tốc độ chuyển động, đồ thị quãng đường - thời gian và phản xạ ánh sáng KHTN 7",
      "Quang hợp, hô hấp tế bào và trao đổi nước ở thực vật KHTN 7 KNTT",
    ],
    "Lớp 8": [
      "Khối lượng riêng, áp suất chất lỏng, lực đẩy Archimedes và định luật đòn bẩy KHTN 8",
      "Cấu tạo và chức năng các hệ cơ quan trong cơ thể người KHTN 8 KNTT",
    ],
    "Lớp 9": [
      "Định luật Ohm, đoạn mạch nối tiếp - song song và công suất điện KHTN 9 KNTT",
      "Hiện tượng khúc xạ ánh sáng, thấu kính hội tụ và thấu kính phân kì KHTN 9",
    ],
    "Giáo sư": [
      "Giáo sư Khoa học Tự nhiên: Liên ngành Vật lí - Hóa học - Sinh học về biến đổi khí hậu và năng lượng sạch",
      "Giáo sư Khoa học Vật liệu: Vật liệu siêu dẫn, bán dẫn nano và pin thể rắn thế hệ mới",
    ],
  },
  nguvan: {
    "Lớp 6": ["Dàn ý bài văn kể lại một trải nghiệm của bản thân Ngữ văn 6 Kết nối tri thức"],
    "Lớp 7": ["Phân tích đặc điểm nhân vật trong truyện ngụ ngôn hoặc truyện khoa học viễn tưởng Văn 7"],
    "Lớp 8": ["Cách phân tích một bài thơ Đường luật (thất ngôn bát cú) Ngữ văn 8 KNTT"],
    "Lớp 9": ["Dàn ý đoạn văn nghị luận xã hội 200 chữ và phân tích tác phẩm văn học ôn thi vào 10"],
    "Lớp 10": ["Phân tích đặc trưng thể loại Thần thoại, Sử thi và Thơ trữ tình Ngữ văn 10 KNTT"],
    "Lớp 11": ["Lập dàn ý bài văn nghị luận về một vấn đề xã hội hoặc tác phẩm truyện thơ Văn 11 KNTT"],
    "Lớp 12": [
      "Dàn ý đoạn văn nghị luận xã hội 200 chữ về bản lĩnh tuổi trẻ trong kỷ nguyên AI",
      "Dàn ý bài văn nghị luận 600 chữ phân tích đánh giá một tác phẩm thơ/truyện hiện đại Văn 12",
    ],
    "Giáo sư": [
      "Giáo sư Văn học & Triết học: Thi pháp học hiện đại, phân tâm học và chủ nghĩa hiện sinh trong văn chương",
      "Giáo sư Ngữ văn: Phân tích chiều sâu tư tưởng mỹ học phương Đông và phương Tây qua các kiệt tác Nobel Văn học",
    ],
  },
  tienganh: {
    "Lớp 6": ["Tổng hợp từ vựng và ngữ pháp Thì hiện tại đơn & Hiện tại tiếp diễn Tiếng Anh 6 Global Success"],
    "Lớp 7": ["Cách phát âm đuôi -ed, -s/-es kèm 5 câu trắc nghiệm có gạch chân giải thích chi tiết"],
    "Lớp 8": ["Ngữ pháp Câu ghép (Compound sentences) và Động từ chỉ sự yêu ghét Tiếng Anh 8 Global Success"],
    "Lớp 9": ["Tổng hợp Câu điều kiện, Câu ước (Wish) và Mệnh đề quan hệ ôn thi vào 10 Tiếng Anh 9"],
    "Lớp 10": ["Câu bị động (Passive Voice), Thì hiện tại hoàn thành và Mệnh đề quan hệ Tiếng Anh 10 Global Success"],
    "Lớp 11": ["Danh động từ (Gerunds), Phân từ hoàn thành và Câu chẻ (Cleft sentences) Tiếng Anh 11"],
    "Lớp 12": [
      "5 câu trắc nghiệm phát âm & trọng âm chuẩn đề thi Tốt nghiệp THPT Global Success 12",
      "Bài tập sắp xếp đoạn hội thoại/lá thư (a-b-c-d-e) và đọc điền tờ rơi chuẩn format mới 2025-2026",
    ],
    "Giáo sư": [
      "Giáo sư Ngôn ngữ học: Phân tích ngữ âm học, cú pháp học chuyên sâu và viết luận Academic Writing IELTS 9.0",
      "Giáo sư Dịch thuật & Học thuật: Cách viết bài báo khoa học quốc tế (Q1/ISI/Scopus) bằng tiếng Anh chuẩn mực",
    ],
  },
  tinhoc: {
    "Lớp 6": [
      "Tin học 6 (KNTT): Phân biệt Thông tin và Dữ liệu, cách đổi đơn vị lưu trữ Byte, KB, MB, GB",
      "Tin học 6 (KNTT): Mô tả thuật toán bằng sơ đồ khối (cấu trúc tuần tự, rẽ nhánh, lặp)",
      "Tin học 6 (KNTT): Cách tạo sơ đồ tư duy và định dạng văn bản trong Microsoft Word",
    ],
    "Lớp 7": [
      "Tin học 7 (KNTT): Cách dùng các hàm SUM, AVERAGE, MAX, MIN, COUNT trong Excel kèm ví dụ",
      "Tin học 7 (KNTT): Thuật toán tìm kiếm tuần tự, tìm kiếm nhị phân và sắp xếp nổi bọt, sắp xếp chọn",
    ],
    "Lớp 8": [
      "Tin học 8 (KNTT): Phân biệt địa chỉ tương đối (A1) và địa chỉ tuyệt đối ($A$1) trong Excel",
      "Tin học 8 (KNTT): Lập trình Scratch sử dụng biến, cấu trúc rẽ nhánh và vòng lặp vẽ hình đa giác đều",
    ],
    "Lớp 9": [
      "Tin học 9 (KNTT): Cách dùng hàm COUNTIF, SUMIF và hàm điều kiện IF trong Excel kèm bài tập mẫu",
      "Tin học 9 (KNTT): Các bước giải bài toán bằng máy tính và mô phỏng thuật toán trên Scratch/Python",
    ],
    "Lớp 10": [
      "Tin học 10 (KNTT): Lập trình Python câu lệnh rẽ nhánh if-elif-else và vòng lặp for, while kèm code mẫu",
      "Tin học 10 (KNTT): Các thao tác xử lý Danh sách (list), Xâu ký tự (str) và viết Hàm (def) trong Python",
    ],
    "Lớp 11": [
      "Tin học 11 (KNTT): Câu lệnh truy vấn SQL (SELECT, FROM, WHERE, INNER JOIN, ORDER BY) trong Cơ sở dữ liệu",
      "Tin học 11 (KNTT): Cài đặt thuật toán Tìm kiếm nhị phân và Sắp xếp chèn, Sắp xếp chọn bằng Python",
    ],
    "Lớp 12": [
      "Tin học 12 (KNTT): Khái niệm Trí tuệ nhân tạo (AI) và Giao thức mạng TCP/IP, thiết bị mạng LAN/WAN",
      "Tin học 12 (KNTT): Tạo trang web bằng HTML5 (thẻ văn bản, bảng, biểu mẫu form) và định dạng CSS3",
      "Tin học 12 (KNTT): 5 câu trắc nghiệm Đúng/Sai môn Tin học ôn thi Tốt nghiệp THPT có giải thích",
    ],
    "Giáo sư": [
      "Giáo sư Khoa học Máy tính & AI: Kiến trúc Transformer, cơ chế Self-Attention và thuật toán huấn luyện LLM",
      "Giáo sư Thuật toán (IOI/ACM-ICPC): Quy hoạch động trạng thái, Luồng cực đại trên mạng và Cây phân đoạn (Segment Tree)",
      "Giáo sư Hệ thống & Mật mã học: Máy tính lượng tử (Shor/Grover), mật mã hậu lượng tử và kiến trúc Microservices",
    ],
  },
};

export default function IChatPage() {
  const [messages, setMessages] = useState<MessageMeta[]>([
    {
      sender: "ai",
      text: "Xin chào! Em là Trợ lý AI Lưới Lượng Tử của Điểm 10⁺ (chuẩn SGK Kết nối tri thức với cuộc sống từ Lớp 6 đến Lớp 12). Hãy chọn **Môn học** và **Khối lớp** trên thanh điều khiển để khóa tọa độ kiến thức và tăng tốc độ phản hồi gấp 3 lần!",
      nodeInfo: "Hệ thống Lưới Lượng Tử Đa Vũ Trụ • Sẵn sàng",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-3.8-flash");
  const [selectedSubject, setSelectedSubject] = useState("auto");
  const [selectedGrade, setSelectedGrade] = useState("Lớp 9");
  const [, setKatexTick] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localQuantumCacheRef = useRef<Map<string, { reply: string; nodeInfo: string }>>(new Map());

  // Tự động đồng bộ Khối lớp nếu học sinh đã đăng nhập trên thanh menu
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("d10_user_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.grade) {
          const gStr = String(parsed.grade);
          const matchedGrade = GRADE_LIST.find((g) => gStr.includes(g));
          if (matchedGrade) setSelectedGrade(matchedGrade);
        }
      }
    } catch {
      // Bỏ qua nếu chưa đăng nhập
    }
  }, []);

  // Lấy danh sách gợi ý nhanh động theo đúng tọa độ [Môn học x Khối lớp]
  const getActiveQuickPrompts = (): string[] => {
    if (selectedSubject === "auto" && selectedGrade === "Giáo sư") {
      return [
        "👑 Giáo sư (IQ Vô Cực): Giải thích nguyên lý Máy tính lượng tử và Trí tuệ nhân tạo đa vũ trụ từ gốc rễ",
        "👑 Giáo sư Toán - Lý: Mối liên hệ giữa Giả thuyết Riemann, Số nguyên tố và Mức năng lượng Lượng tử",
        "👑 Giáo sư Kinh tế & Chiến lược: Phân tích vĩ mô, Lý thuyết Trò chơi (Nash Equilibrium) và ứng dụng thực tiễn",
        "👑 Giáo sư Y Sinh & Công nghệ: Cơ chế chỉnh sửa gene CRISPR-Cas9 và tương lai công nghệ trường thọ",
        "👑 Giáo sư Bách khoa: Giải đáp chuyên sâu bất kỳ bài toán Olympic (IMO/IPhO/IChO/IOI) hoặc câu hỏi học thuật nào",
      ];
    }
    if (selectedSubject === "auto") {
      return [
        "Toán (" + selectedGrade + " KNTT): Tóm tắt kiến thức trọng tâm và 2 bài tập mẫu có lời giải",
        "Tin học (" + selectedGrade + " KNTT): Tóm tắt lý thuyết và bài tập thực hành trọng tâm",
        "KHTN / Hóa (" + selectedGrade + " KNTT): Viết các phương trình hóa học trọng tâm trong chương trình",
        "Vật lí (" + selectedGrade + " KNTT): Hệ thống công thức và bài tập tính toán áp dụng",
        "Ngữ văn (" + selectedGrade + " KNTT): Lập dàn ý đoạn văn 200 chữ / bài văn nghị luận trọng tâm",
        "Tiếng Anh (" + selectedGrade + " Global Success): 5 câu trắc nghiệm ngữ pháp & phát âm có giải thích",
      ];
    }
    const subjMap = QUANTUM_PROMPTS_MATRIX[selectedSubject] || {};
    const promptsForGrade = subjMap[selectedGrade];
    if (promptsForGrade && promptsForGrade.length > 0) {
      return promptsForGrade;
    }
    const subjLabel =
      SUBJECT_NODES.find((s) => s.id === selectedSubject)?.label.replace(/^[^\s]+\s/, "") || "Môn học";
    return [
      subjLabel + " " + selectedGrade + " (KNTT): Tóm tắt lý thuyết trọng tâm và ví dụ minh họa",
      "Soạn đề kiểm tra 15 phút môn " + subjLabel + " " + selectedGrade + " (Kết nối tri thức) có đáp án",
      "Giải bài tập vận dụng cao môn " + subjLabel + " " + selectedGrade + " từng bước dễ hiểu",
    ];
  };

  useEffect(() => {
    if (!document.getElementById("katex-css")) {
      const link = document.createElement("link");
      link.id = "katex-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
      document.head.appendChild(link);
    }

    const loadMhchem = () => {
      if (!document.getElementById("katex-mhchem-js")) {
        const mhchem = document.createElement("script");
        mhchem.id = "katex-mhchem-js";
        mhchem.src =
          "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/mhchem.min.js";
        mhchem.async = true;
        mhchem.onload = () => setKatexTick((t) => t + 1);
        document.head.appendChild(mhchem);
      } else {
        setKatexTick((t) => t + 1);
      }
    };

    if (window.katex) {
      loadMhchem();
    } else if (!document.getElementById("katex-js")) {
      const script = document.createElement("script");
      script.id = "katex-js";
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
      script.async = true;
      script.onload = () => {
        setKatexTick((t) => t + 1);
        loadMhchem();
      };
      document.head.appendChild(script);
    }

    const timer = setInterval(() => {
      if (window.katex) {
        setKatexTick((t) => t + 1);
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const evalMathExpr = (exprStr: string, xVal: number): number => {
    try {
      if (!exprStr || !exprStr.trim()) return NaN;
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
        .replace(/\bx\b/gi, "(" + String(xVal) + ")");

      const fn = new Function("return " + normalized + ";");
      const res = Number(fn());
      return Number.isFinite(res) ? res : NaN;
    } catch {
      return NaN;
    }
  };

  // 1. BỘ VẼ ĐỒ THỊ HÀM SỐ & TỌA ĐỘ OXY
  const renderFunctionGraph = (jsonStr: string): string => {
    try {
      const config: GraphConfig = JSON.parse(jsonStr.trim());
      const expressions =
        config.exprs ||
        (config.expr && config.expr.trim() ? [config.expr] : ["x^2"]);
      const xRange = config.xRange || [-4, 4];
      const yRange = config.yRange || [-2, 6];
      const xMin = xRange[0] ?? -4;
      const xMax = xRange[1] ?? 4;
      const yMin = yRange[0] ?? -2;
      const yMax = yRange[1] ?? 6;
      const points = config.points || [];
      const segments = config.segments || [];
      const circles = config.circles || [];

      const width = 420;
      const height = 340;
      const pad = 36;
      const rightBound = width - pad;
      const bottomBound = height - pad;
      const plotW = width - pad * 2;
      const plotH = height - pad * 2;

      const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
      const toSvgY = (y: number) =>
        bottomBound - ((y - yMin) / (yMax - yMin)) * plotH;

      const originX = Math.min(Math.max(toSvgX(0), pad), rightBound);
      const originY = Math.min(Math.max(toSvgY(0), pad), bottomBound);

      const svgParts: string[] = [];
      svgParts.push(
        '<defs><marker id="arrow-oxy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" /></marker></defs>'
      );

      for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const sx = toSvgX(x);
        svgParts.push(
          '<line x1="' +
            sx +
            '" y1="' +
            pad +
            '" x2="' +
            sx +
            '" y2="' +
            bottomBound +
            '" stroke="#e5e7eb" stroke-width="1" />'
        );
        if (x !== 0) {
          svgParts.push(
            '<line x1="' +
              sx +
              '" y1="' +
              (originY - 3) +
              '" x2="' +
              sx +
              '" y2="' +
              (originY + 3) +
              '" stroke="#374151" stroke-width="1.2" />'
          );
          svgParts.push(
            '<text x="' +
              sx +
              '" y="' +
              (originY + 15) +
              '" font-size="11" fill="#4b5563" text-anchor="middle">' +
              x +
              "</text>"
          );
        }
      }

      for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const sy = toSvgY(y);
        svgParts.push(
          '<line x1="' +
            pad +
            '" y1="' +
            sy +
            '" x2="' +
            rightBound +
            '" y2="' +
            sy +
            '" stroke="#e5e7eb" stroke-width="1" />'
        );
        if (y !== 0) {
          svgParts.push(
            '<line x1="' +
              (originX - 3) +
              '" y1="' +
              sy +
              '" x2="' +
              (originX + 3) +
              '" y2="' +
              sy +
              '" stroke="#374151" stroke-width="1.2" />'
          );
          svgParts.push(
            '<text x="' +
              (originX - 8) +
              '" y="' +
              (sy + 4) +
              '" font-size="11" fill="#4b5563" text-anchor="end">' +
              y +
              "</text>"
          );
        }
      }

      svgParts.push(
        '<line x1="' +
          (pad - 10) +
          '" y1="' +
          originY +
          '" x2="' +
          (rightBound + 12) +
          '" y2="' +
          originY +
          '" stroke="#111827" stroke-width="1.6" />'
      );
      svgParts.push(
        '<polygon points="' +
          (rightBound + 16) +
          "," +
          originY +
          " " +
          (rightBound + 8) +
          "," +
          (originY - 4) +
          " " +
          (rightBound + 8) +
          "," +
          (originY + 4) +
          '" fill="#111827" />'
      );
      svgParts.push(
        '<text x="' +
          (rightBound + 14) +
          '" y="' +
          (originY - 8) +
          '" font-size="13" font-style="italic" font-weight="bold" fill="#111827">x</text>'
      );

      svgParts.push(
        '<line x1="' +
          originX +
          '" y1="' +
          (bottomBound + 10) +
          '" x2="' +
          originX +
          '" y2="' +
          (pad - 12) +
          '" stroke="#111827" stroke-width="1.6" />'
      );
      svgParts.push(
        '<polygon points="' +
          originX +
          "," +
          (pad - 16) +
          " " +
          (originX - 4) +
          "," +
          (pad - 8) +
          " " +
          (originX + 4) +
          "," +
          (pad - 8) +
          '" fill="#111827" />'
      );
      svgParts.push(
        '<text x="' +
          (originX + 10) +
          '" y="' +
          (pad - 6) +
          '" font-size="13" font-style="italic" font-weight="bold" fill="#111827">y</text>'
      );
      svgParts.push(
        '<text x="' +
          (originX - 10) +
          '" y="' +
          (originY + 15) +
          '" font-size="12" font-style="italic" font-weight="bold" fill="#111827">O</text>'
      );

      circles.forEach((c) => {
        const cx = toSvgX(c.x);
        const cy = toSvgY(c.y);
        const rx = Math.abs(toSvgX(c.x + c.r) - cx);
        const ry = Math.abs(toSvgY(c.y + c.r) - cy);
        const dash = c.style === "dashed" ? ' stroke-dasharray="5 4"' : "";
        svgParts.push(
          '<ellipse cx="' +
            cx +
            '" cy="' +
            cy +
            '" rx="' +
            rx +
            '" ry="' +
            ry +
            '" fill="none" stroke="#2563eb" stroke-width="2"' +
            dash +
            " />"
        );
      });

      segments.forEach((seg) => {
        const x1 = toSvgX(seg.from[0] ?? 0);
        const y1 = toSvgY(seg.from[1] ?? 0);
        const x2 = toSvgX(seg.to[0] ?? 0);
        const y2 = toSvgY(seg.to[1] ?? 0);
        const dash = seg.style === "dashed" ? ' stroke-dasharray="5 4"' : "";
        const marker = seg.vector ? ' marker-end="url(#arrow-oxy)"' : "";
        svgParts.push(
          '<line x1="' +
            x1 +
            '" y1="' +
            y1 +
            '" x2="' +
            x2 +
            '" y2="' +
            y2 +
            '" stroke="#2563eb" stroke-width="2"' +
            dash +
            marker +
            " />"
        );
      });

      const colors = ["#2563eb", "#16a34a", "#dc2626"];
      const steps = 300;
      const ySpan = yMax - yMin;

      expressions.forEach((expr, idx) => {
        const color = colors[idx % colors.length] ?? "#2563eb";
        let pathD = "";
        let drawing = false;
        let prevY = NaN;

        for (let i = 0; i <= steps; i++) {
          const x = xMin + (i / steps) * (xMax - xMin);
          const y = evalMathExpr(expr, x);

          if (
            Number.isFinite(y) &&
            y >= yMin - ySpan * 0.15 &&
            y <= yMax + ySpan * 0.15
          ) {
            const sx = toSvgX(x).toFixed(2);
            const sy = toSvgY(y).toFixed(2);
            if (
              drawing &&
              Number.isFinite(prevY) &&
              Math.abs(y - prevY) > ySpan * 0.8
            ) {
              drawing = false;
            }
            pathD += drawing ? " L " + sx + " " + sy : "M " + sx + " " + sy;
            drawing = true;
          } else {
            drawing = false;
          }
          prevY = y;
        }

        if (pathD) {
          svgParts.push(
            '<path d="' +
              pathD +
              '" fill="none" stroke="' +
              color +
              '" stroke-width="2.4" stroke-linecap="round" />'
          );
        }
      });

      points.forEach((pt) => {
        if (pt.x >= xMin && pt.x <= xMax && pt.y >= yMin && pt.y <= yMax) {
          const px = toSvgX(pt.x);
          const py = toSvgY(pt.y);

          if (pt.x !== 0 && pt.y !== 0) {
            svgParts.push(
              '<line x1="' +
                px +
                '" y1="' +
                py +
                '" x2="' +
                px +
                '" y2="' +
                originY +
                '" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 3" />'
            );
            svgParts.push(
              '<line x1="' +
                px +
                '" y1="' +
                py +
                '" x2="' +
                originX +
                '" y2="' +
                py +
                '" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 3" />'
            );
          }
          svgParts.push(
            '<circle cx="' +
              px +
              '" cy="' +
              py +
              '" r="4" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />'
          );
          if (pt.label) {
            svgParts.push(
              '<text x="' +
                (px + 6) +
                '" y="' +
                (py - 6) +
                '" font-size="12" font-weight="bold" fill="#1e3a8a">' +
                pt.label +
                "</text>"
            );
          }
        }
      });

      const firstExpr = expressions[0] ?? "";
      const titleLabel =
        config.label ||
        (firstExpr ? "Đồ thị hàm số y = " + firstExpr : "Hệ trục tọa độ Oxy");

      return (
        '<div class="my-3 p-3 bg-white border border-blue-100 rounded-xl shadow-sm flex flex-col items-center">' +
        '<div class="text-xs font-bold text-blue-800 mb-1">' +
        titleLabel +
        "</div>" +
        '<svg viewBox="0 0 ' +
        width +
        " " +
        height +
        '" class="w-full max-w-[420px] h-auto select-none">' +
        svgParts.join("") +
        "</svg></div>"
      );
    } catch {
      return "";
    }
  };

  // 2. BỘ VẼ HÌNH HỌC PHẲNG, HÌNH KHÔNG GIAN 3D & HỆ TRỤC OXYZ
  const renderGeometryBlock = (jsonStr: string): string => {
    try {
      const config: GeoConfig = JSON.parse(jsonStr.trim());
      if (!config.points || Object.keys(config.points).length === 0) return "";

      const project = (coords: number[]): { x: number; y: number } => {
        if (coords.length >= 3) {
          const x = Number(coords[0]) || 0;
          const y = Number(coords[1]) || 0;
          const z = Number(coords[2]) || 0;
          return {
            x: y - x * 0.45,
            y: z - x * 0.35,
          };
        }
        return {
          x: Number(coords[0]) || 0,
          y: Number(coords[1]) || 0,
        };
      };

      const projectedPoints: Record<string, { x: number; y: number }> = {};
      Object.entries(config.points).forEach(([name, coords]) => {
        if (Array.isArray(coords)) {
          projectedPoints[name] = project(coords);
        }
      });

      const ptValues = Object.values(projectedPoints);
      if (ptValues.length === 0) return "";

      let minX = Math.min(...ptValues.map((p) => p.x));
      let maxX = Math.max(...ptValues.map((p) => p.x));
      let minY = Math.min(...ptValues.map((p) => p.y));
      let maxY = Math.max(...ptValues.map((p) => p.y));

      (config.circles || []).forEach((c) => {
        const center = projectedPoints[c.center];
        if (center) {
          const rx = c.r || 1;
          const ry = c.ry || c.r || 1;
          minX = Math.min(minX, center.x - rx);
          maxX = Math.max(maxX, center.x + rx);
          minY = Math.min(minY, center.y - ry);
          maxY = Math.max(maxY, center.y + ry);
        }
      });

      const width = 420;
      const height = 320;
      const pad = 48;
      const plotW = width - pad * 2;
      const plotH = height - pad * 2;

      const spanX = Math.max(maxX - minX, 1);
      const spanY = Math.max(maxY - minY, 1);
      const scale = Math.min(plotW / spanX, plotH / spanY);
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      const toSvgX = (x: number) => width / 2 + (x - midX) * scale;
      const toSvgY = (y: number) => height / 2 - (y - midY) * scale;

      const svgParts: string[] = [];
      svgParts.push(
        '<defs><marker id="geo-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4ed8" /></marker><marker id="axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#374151" /></marker></defs>'
      );

      if (config.axes === "Oxyz") {
        const o = project([0, 0, 0]);
        const axX = project([4.5, 0, 0]);
        const axY = project([0, 4.5, 0]);
        const axZ = project([0, 0, 4.5]);
        svgParts.push(
          '<line x1="' +
            toSvgX(o.x) +
            '" y1="' +
            toSvgY(o.y) +
            '" x2="' +
            toSvgX(axX.x) +
            '" y2="' +
            toSvgY(axX.y) +
            '" stroke="#4b5563" stroke-width="1.4" marker-end="url(#axis-arrow)" />'
        );
        svgParts.push(
          '<text x="' +
            (toSvgX(axX.x) - 10) +
            '" y="' +
            (toSvgY(axX.y) + 14) +
            '" font-size="13" font-style="italic" font-weight="bold" fill="#111827">x</text>'
        );
        svgParts.push(
          '<line x1="' +
            toSvgX(o.x) +
            '" y1="' +
            toSvgY(o.y) +
            '" x2="' +
            toSvgX(axY.x) +
            '" y2="' +
            toSvgY(axY.y) +
            '" stroke="#4b5563" stroke-width="1.4" marker-end="url(#axis-arrow)" />'
        );
        svgParts.push(
          '<text x="' +
            (toSvgX(axY.x) + 8) +
            '" y="' +
            (toSvgY(axY.y) + 4) +
            '" font-size="13" font-style="italic" font-weight="bold" fill="#111827">y</text>'
        );
        svgParts.push(
          '<line x1="' +
            toSvgX(o.x) +
            '" y1="' +
            toSvgY(o.y) +
            '" x2="' +
            toSvgX(axZ.x) +
            '" y2="' +
            toSvgY(axZ.y) +
            '" stroke="#4b5563" stroke-width="1.4" marker-end="url(#axis-arrow)" />'
        );
        svgParts.push(
          '<text x="' +
            (toSvgX(axZ.x) + 8) +
            '" y="' +
            (toSvgY(axZ.y) + 4) +
            '" font-size="13" font-style="italic" font-weight="bold" fill="#111827">z</text>'
        );
      }

      (config.rightAngles || []).forEach((ra) => {
        if (ra.length === 3) {
          const p1 = projectedPoints[ra[0] ?? ""];
          const pv = projectedPoints[ra[1] ?? ""];
          const p2 = projectedPoints[ra[2] ?? ""];
          if (p1 && pv && p2) {
            const vx = toSvgX(pv.x);
            const vy = toSvgY(pv.y);
            const dx1 = toSvgX(p1.x) - vx;
            const dy1 = toSvgY(p1.y) - vy;
            const len1 = Math.hypot(dx1, dy1) || 1;
            const dx2 = toSvgX(p2.x) - vx;
            const dy2 = toSvgY(p2.y) - vy;
            const len2 = Math.hypot(dx2, dy2) || 1;

            const size = 10;
            const u1x = (dx1 / len1) * size;
            const u1y = (dy1 / len1) * size;
            const u2x = (dx2 / len2) * size;
            const u2y = (dy2 / len2) * size;

            svgParts.push(
              '<polyline points="' +
                (vx + u1x) +
                "," +
                (vy + u1y) +
                " " +
                (vx + u1x + u2x) +
                "," +
                (vy + u1y + u2y) +
                " " +
                (vx + u2x) +
                "," +
                (vy + u2y) +
                '" fill="none" stroke="#dc2626" stroke-width="1.3" />'
            );
          }
        }
      });

      (config.circles || []).forEach((c) => {
        const center = projectedPoints[c.center];
        if (center) {
          const cx = toSvgX(center.x);
          const cy = toSvgY(center.y);
          const rx = (c.r || 1) * scale;
          const ry = (c.ry || c.r || 1) * scale;
          const dash = c.style === "dashed" ? ' stroke-dasharray="6 4"' : "";
          svgParts.push(
            '<ellipse cx="' +
              cx +
              '" cy="' +
              cy +
              '" rx="' +
              rx +
              '" ry="' +
              ry +
              '" fill="none" stroke="#1e40af" stroke-width="1.8"' +
              dash +
              " />"
          );
        }
      });

      (config.segments || []).forEach((seg) => {
        const pFrom = projectedPoints[seg.from];
        const pTo = projectedPoints[seg.to];
        if (pFrom && pTo) {
          const x1 = toSvgX(pFrom.x);
          const y1 = toSvgY(pFrom.y);
          const x2 = toSvgX(pTo.x);
          const y2 = toSvgY(pTo.y);
          const isDashed = seg.style === "dashed";
          const dashAttr = isDashed ? ' stroke-dasharray="6 4"' : "";
          const color = isDashed ? "#4b5563" : "#1e3a8a";
          const widthLine = isDashed ? "1.6" : "2.1";
          const marker = seg.vector ? ' marker-end="url(#geo-arrow)"' : "";

          svgParts.push(
            '<line x1="' +
              x1 +
              '" y1="' +
              y1 +
              '" x2="' +
              x2 +
              '" y2="' +
              y2 +
              '" stroke="' +
              color +
              '" stroke-width="' +
              widthLine +
              '" stroke-linecap="round"' +
              dashAttr +
              marker +
              " />"
          );

          if (seg.label) {
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2 - 6;
            svgParts.push(
              '<text x="' +
                mx +
                '" y="' +
                my +
                '" font-size="11" fill="#be123c" font-weight="bold" text-anchor="middle">' +
                seg.label +
                "</text>"
            );
          }
        }
      });

      const centerSvgX =
        ptValues.reduce((acc, p) => acc + toSvgX(p.x), 0) / ptValues.length;
      const centerSvgY =
        ptValues.reduce((acc, p) => acc + toSvgY(p.y), 0) / ptValues.length;

      Object.entries(projectedPoints).forEach(([name, pt]) => {
        const sx = toSvgX(pt.x);
        const sy = toSvgY(pt.y);
        const vx = sx - centerSvgX;
        const vy = sy - centerSvgY;
        const dist = Math.hypot(vx, vy) || 1;
        const offsetX = (vx / dist) * 16;
        const offsetY = (vy / dist) * 16;

        svgParts.push(
          '<circle cx="' + sx + '" cy="' + sy + '" r="3.2" fill="#1e3a8a" />'
        );
        svgParts.push(
          '<text x="' +
            (sx + offsetX) +
            '" y="' +
            (sy + offsetY + 4) +
            '" font-size="13" font-family="serif" font-style="italic" font-weight="bold" fill="#111827" text-anchor="middle">' +
            name +
            "</text>"
        );
      });

      const titleLabel = config.title || "Hình minh họa";

      return (
        '<div class="my-3 p-3 bg-white border border-blue-100 rounded-xl shadow-sm flex flex-col items-center">' +
        '<div class="text-xs font-bold text-blue-800 mb-1">' +
        titleLabel +
        "</div>" +
        '<svg viewBox="0 0 ' +
        width +
        " " +
        height +
        '" class="w-full max-w-[420px] h-auto select-none">' +
        svgParts.join("") +
        "</svg></div>"
      );
    } catch {
      return "";
    }
  };

  // 3. BỘ XỬ LÝ CÔNG THỨC TOÁN - LÝ - HÓA - SINH & ĐỊNH DẠNG ĐA MÔN HỌC
  const formatAIMessage = (rawText: string) => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const convertLatexToRichHtml = (inputTex: string): string => {
      let s = escapeHtml(inputTex.trim());

      for (let i = 0; i < 5; i++) {
        s = s.replace(
          /\\(?:text|mathrm|textbf|textit|mathit|mathbf|ce|pu)\{([^{}]*)\}/g,
          "$1"
        );
      }

      s = s
        .replace(/\^\{?\s*\\circ\s*\}?/g, "°")
        .replace(/\bt\^\{?o\}?\b/g, "t°")
        .replace(/\\degree/g, "°");

      s = s
        .replace(
          /\\xrightarrow\[([^{}\]]*)\]\{([^{}]*)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1.5"><span class="text-[11px] font-medium text-blue-900 leading-tight px-2 border-b-[1.5px] border-blue-800">$2</span><span class="text-[10px] text-gray-600 leading-tight">$1</span></span><span class="-ml-2 mr-1 text-blue-900 font-bold">►</span>'
        )
        .replace(
          /\\xrightarrow\{([^{}]*)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1.5"><span class="text-[11px] font-medium text-blue-900 leading-tight px-2 border-b-[1.5px] border-blue-800">$1</span><span class="text-[7px] leading-none">&nbsp;</span></span><span class="-ml-2 mr-1 text-blue-900 font-bold">►</span>'
        )
        .replace(
          /\\xrightleftharpoons(?:\[([^{}\]]*)\])?\{([^{}]*)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1.5"><span class="text-[11px] font-medium text-blue-900 leading-tight px-1.5">$2</span><span class="text-sm leading-none text-blue-900">⇌</span></span>'
        )
        .replace(
          /\\overset\{([^{}]*)\}\{\\(?:longrightarrow|rightarrow|to)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1.5"><span class="text-[11px] font-medium text-blue-900 leading-tight px-2 border-b-[1.5px] border-blue-800">$1</span><span class="text-[7px] leading-none">&nbsp;</span></span><span class="-ml-2 mr-1 text-blue-900 font-bold">►</span>'
        );

      for (let i = 0; i < 3; i++) {
        s = s.replace(
          /\\(?:d?frac|tfrac)\{([^{}]+)\}\{([^{}]+)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1 text-[0.95em] leading-tight"><span class="border-b border-current px-1 pb-0.5">$1</span><span class="px-1 pt-0.5">$2</span></span>'
        );
      }

      for (let i = 0; i < 2; i++) {
        s = s
          .replace(
            /\\sqrt\[([^{}\]]+)\]\{([^{}]+)\}/g,
            '<sup class="text-[10px]">$1</sup>√<span class="border-t border-current px-0.5">$2</span>'
          )
          .replace(
            /\\sqrt\{([^{}]+)\}/g,
            '√<span class="border-t border-current px-0.5">$1</span>'
          )
          .replace(
            /\\(?:overrightarrow|vec)\{([^{}]+)\}/g,
            '<span class="inline-block border-t border-current leading-none pt-0.5">$1</span>'
          )
          .replace(/\\widehat\{([^{}]+)\}/g, "∠$1")
          .replace(/\\underline\{([^{}]+)\}/g, "<u>$1</u>");
      }

      s = s
        .replace(/\\displaystyle/g, "")
        .replace(/\\left\s*([(\[\{|])/g, "$1")
        .replace(/\\right\s*([)\]\}|])/g, "$1")
        .replace(/\\times/g, " × ")
        .replace(/\\div/g, " ÷ ")
        .replace(/\\cdot/g, " · ")
        .replace(/\\pm/g, " ± ")
        .replace(/\\mp/g, " ∓ ")
        .replace(/\\leq|\\le/g, " ≤ ")
        .replace(/\\geq|\\ge/g, " ≥ ")
        .replace(/\\neq|\\ne/g, " ≠ ")
        .replace(/\\approx/g, " ≈ ")
        .replace(/\\equiv/g, " ≡ ")
        .replace(/\\sim/g, " ∼ ")
        .replace(/\\infty/g, "∞")
        .replace(/\\in\b/g, " ∈ ")
        .replace(/\\notin\b/g, " ∉ ")
        .replace(/\\subset/g, " ⊂ ")
        .replace(/\\cup/g, " ∪ ")
        .replace(/\\cap/g, " ∩ ")
        .replace(/\\emptyset|\\varnothing/g, "∅")
        .replace(/\\forall/g, "∀")
        .replace(/\\exists/g, "∃")
        .replace(/\\mathbb\{R\}/g, "ℝ")
        .replace(/\\mathbb\{Z\}/g, "ℤ")
        .replace(/\\mathbb\{N\}/g, "ℕ")
        .replace(/\\mathbb\{Q\}/g, "ℚ")
        .replace(/\\rightarrow|\\to|\\longrightarrow/g, " → ")
        .replace(/\\leftarrow/g, " ← ")
        .replace(/\\leftrightarrow|\\rightleftharpoons/g, " ⇌ ")
        .replace(/\\Rightarrow/g, " ⇒ ")
        .replace(/\\Leftrightarrow|\\iff/g, " ⇔ ")
        .replace(/\\uparrow/g, "↑")
        .replace(/\\downarrow/g, "↓")
        .replace(/\\Delta/g, "Δ")
        .replace(/\\Omega/g, "Ω")
        .replace(/\\Phi/g, "Φ")
        .replace(/\\pi/g, "π")
        .replace(/\\alpha/g, "α")
        .replace(/\\beta/g, "β")
        .replace(/\\gamma/g, "γ")
        .replace(/\\delta/g, "δ")
        .replace(/\\epsilon|\\varepsilon/g, "ε")
        .replace(/\\lambda/g, "λ")
        .replace(/\\mu/g, "μ")
        .replace(/\\omega/g, "ω")
        .replace(/\\varphi|\\phi/g, "φ")
        .replace(/\\sigma/g, "σ")
        .replace(/\\theta/g, "θ")
        .replace(/\\AA/g, "Å")
        .replace(/\\male/g, "♂")
        .replace(/\\female/g, "♀")
        .replace(/\\int/g, "∫")
        .replace(/\\sum/g, "∑")
        .replace(/\\lim/g, "lim")
        .replace(/\\quad|\\qquad|\\,|\\;|\\!/g, " ");

      s = s
        .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
        .replace(/\^([0-9a-zA-Z+\-°]+)/g, "<sup>$1</sup>")
        .replace(/\_\{([^{}]+)\}/g, "<sub>$1</sub>")
        .replace(/\_([0-9a-zA-Z+\-]+)/g, "<sub>$1</sub>");

      s = s.replace(/\\([a-zA-Z]+)/g, "$1").replace(/[{}]/g, "");

      return s;
    };

    const renderMath = (tex: string, displayMode: boolean) => {
      const cleanTex = tex
        .trim()
        .replace(/\bt\^o\b/g, "t^\\circ")
        .replace(/\\frac\b/g, "\\dfrac")
        .replace(/\\lim\b/g, "\\displaystyle\\lim")
        .replace(/\\sum\b/g, "\\displaystyle\\sum")
        .replace(/\\int\b/g, "\\displaystyle\\int");

      const hasComplexChemArrow =
        /\\xrightarrow|\\xrightleftharpoons/.test(cleanTex) &&
        /[^\x00-\x7F]/.test(cleanTex);

      if (
        typeof window !== "undefined" &&
        window.katex &&
        !hasComplexChemArrow
      ) {
        try {
          return window.katex
            .renderToString(cleanTex, {
              displayMode,
              throwOnError: true,
              strict: false,
              trust: true,
            })
            .replace(/\r?\n/g, " ");
        } catch {
          // Chuyển sang bộ dựng HTML nội bộ nếu KaTeX báo lỗi
        }
      }

      const richHtml = convertLatexToRichHtml(cleanTex);
      return displayMode
        ? '<div class="my-2.5 py-2.5 px-4 bg-blue-50/80 border border-blue-100 rounded-xl font-semibold text-blue-950 text-center overflow-x-auto">' +
            richHtml +
            "</div>"
        : '<span class="font-semibold text-blue-950">' + richHtml + "</span>";
    };

    const specialBlocks: string[] = [];
    const saveBlock = (html: string) => {
      const id = "@@@" + String(specialBlocks.length) + "@@@";
      specialBlocks.push(html);
      return id;
    };

    let processed = rawText.replace(/<u>([\s\S]*?)<\/u>/gi, (_, content) =>
      saveBlock(
        '<u class="decoration-2 decoration-blue-700 underline-offset-4 font-bold text-blue-900">' +
          escapeHtml(String(content)) +
          "</u>"
      )
    );

    processed = processed.replace(
      /\x60\x60\x60graph\s*([\s\S]*?)\x60\x60\x60/gi,
      (_, json) => {
        const graphHtml = renderFunctionGraph(String(json));
        return graphHtml ? "\n" + saveBlock(graphHtml) + "\n" : "";
      }
    );

    processed = processed.replace(
      /\x60\x60\x60geo\s*([\s\S]*?)\x60\x60\x60/gi,
      (_, json) => {
        const geoHtml = renderGeometryBlock(String(json));
        return geoHtml ? "\n" + saveBlock(geoHtml) + "\n" : "";
      }
    );

    processed = processed.replace(
      /\x60\x60\x60svg\s*([\s\S]*?)\x60\x60\x60/gi,
      (_, svgCode) => {
        const cleanSvg = String(svgCode).trim().replace(/\r?\n/g, " ");
        return (
          "\n" +
          saveBlock(
            '<div class="my-3 p-3 bg-white border border-blue-100 rounded-xl shadow-sm flex justify-center overflow-x-auto">' +
              cleanSvg +
              "</div>"
          ) +
          "\n"
        );
      }
    );

    // Tách khối mã nguồn Tin học (Python, SQL, HTML, CSS, Scratch, Excel...) giữ nguyên thụt lề
    processed = processed.replace(
      /\x60\x60\x60([a-zA-Z0-9_+\-]*)\s*\n([\s\S]*?)\x60\x60\x60/g,
      (_, lang, codeContent) => {
        const langLabel = String(lang || "code").toUpperCase();
        const escapedCode = escapeHtml(String(codeContent).replace(/\s+$/, ""));
        return (
          "\n" +
          saveBlock(
            '<div class="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-sm">' +
              '<div class="px-3.5 py-1.5 bg-slate-800 text-[11px] font-mono font-bold text-cyan-300 border-b border-slate-700 flex justify-between items-center">' +
              "<span>💻 " +
              langLabel +
              "</span><span>Điểm 10⁺ Code</span></div>" +
              '<pre class="p-3.5 text-xs md:text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">' +
              escapedCode +
              "</pre></div>"
          ) +
          "\n"
        );
      }
    );

    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      return (
        "\n" +
        saveBlock(
          '<div class="my-2 overflow-x-auto">' +
            renderMath(String(tex), true) +
            "</div>"
        ) +
        "\n"
      );
    });

    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => {
      return (
        "\n" +
        saveBlock(
          '<div class="my-2 overflow-x-auto">' +
            renderMath(String(tex), true) +
            "</div>"
        ) +
        "\n"
      );
    });

    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, tex) =>
      saveBlock(renderMath(String(tex), false))
    );
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) =>
      saveBlock(renderMath(String(tex), false))
    );

    processed = processed.replace(
      /^([^\n]*(?:\\xrightarrow|\\xrightleftharpoons)[^\n]*)$/gm,
      (line) => {
        if (line.includes("@@@")) return line;
        return (
          "\n" +
          saveBlock(
            '<div class="my-2 overflow-x-auto">' +
              renderMath(line, true) +
              "</div>"
          ) +
          "\n"
        );
      }
    );

    processed = processed.replace(
      /\(([^()\n]*\\(?:text|mathrm|ce|dfrac|frac|sqrt|rightarrow|to)[^()\n]*)\)/g,
      (_, innerTex) => {
        if (String(innerTex).includes("@@@")) return "(" + innerTex + ")";
        return "(" + saveBlock(renderMath(String(innerTex), false)) + ")";
      }
    );

    processed = processed.replace(
      /(?:\\(?:text|mathrm|ce)\{[^{}]+\}(?:_\{?[0-9a-zA-Z+\-]+\}?|\^\{?[0-9a-zA-Z+\-°]+\}?)*|\\(?:d?frac)\{[^{}]+\}\{[^{}]+\}|\\sqrt(?:\[[^\]\n]+\])?\{[^{}]+\}|(?:[A-Z][a-z]?(?:_\{?[0-9a-zA-Z+\-]+\}?|\^\{?[0-9a-zA-Z+\-°]+\}?)+)+)+/g,
      (match) => {
        if (match.includes("@@@")) return match;
        return saveBlock(renderMath(match, false));
      }
    );

    processed = processed
      .replace(/\s+---\s+/g, "\n---\n")
      .replace(/\s+(#{2,4}\s+)/g, "\n$1");

    processed = escapeHtml(processed)
      .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />')
      .replace(
        /^####\s+(.+)$/gm,
        '<div class="font-bold text-blue-700 text-sm md:text-base mt-2.5 mb-1">$1</div>'
      )
      .replace(
        /^###\s+(.+)$/gm,
        '<div class="font-bold text-blue-800 text-base md:text-lg mt-3 mb-1">$1</div>'
      )
      .replace(
        /^##\s+(.+)$/gm,
        '<div class="font-bold text-blue-900 text-lg md:text-xl mt-3.5 mb-1.5">$1</div>'
      )
      .replace(
        /^&gt;\s*(.+)$/gm,
        '<blockquote class="border-l-4 border-blue-400 bg-blue-50/50 pl-3 py-1 my-1.5 italic text-gray-700">$1</blockquote>'
      )
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="font-bold text-gray-900">$1</strong>'
      )
      .replace(/^\s*[\*\-]\s+/gm, "• ")
      .replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(
        /\x60([^\x60\n]+)\x60/g,
        '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(/10\+/g, '10<sup class="font-bold">+</sup>');

    const rawLines = processed
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const groupedBlocks: string[] = [];
    let idx = 0;

    while (idx < rawLines.length) {
      const currentLine = rawLines[idx] ?? "";
      if (/^\|.*\|$/.test(currentLine)) {
        const tableLines: string[] = [];
        while (idx < rawLines.length && /^\|.*\|$/.test(rawLines[idx] ?? "")) {
          tableLines.push(rawLines[idx] ?? "");
          idx++;
        }

        const validRows = tableLines.filter((row) => {
          const cells = row
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());
          return !cells.every((c) => /^[:\-\s]+$/.test(c));
        });

        if (validRows.length > 0) {
          const rowsHtml = validRows
            .map((row, rIdx) => {
              const cells = row
                .slice(1, -1)
                .split("|")
                .map((c) => c.trim());
              const cellsHtml = cells
                .map((cell, cIdx) => {
                  const isHeaderCell =
                    cIdx === 0 || (rIdx === 0 && validRows.length > 2);
                  const cellStyle = isHeaderCell
                    ? "bg-blue-50/80 font-semibold text-blue-950"
                    : "bg-white text-gray-800";
                  return (
                    '<td class="border border-blue-200 px-3.5 py-2 text-center ' +
                    cellStyle +
                    '">' +
                    cell +
                    "</td>"
                  );
                })
                .join("");
              return "<tr>" + cellsHtml + "</tr>";
            })
            .join("");

          groupedBlocks.push(
            '<div class="my-2.5 overflow-x-auto"><table class="border-collapse border border-blue-200 text-sm md:text-base">' +
              rowsHtml +
              "</table></div>"
          );
        }
      } else {
        groupedBlocks.push(currentLine);
        idx++;
      }
    }

    return groupedBlocks.map((block, i) => {
      let restoredBlock = block;
      for (let pass = 0; pass < 5; pass++) {
        if (!/@@@(\d+)@@@/.test(restoredBlock)) break;
        restoredBlock = restoredBlock.replace(
          /@@@(\d+)@@@/g,
          (_, bIdx) => specialBlocks[Number(bIdx)] || ""
        );
      }
      return (
        <div
          key={i}
          className="leading-loose py-0.5"
          dangerouslySetInnerHTML={{ __html: restoredBlock }}
        />
      );
    });
  };

  const handleSend = async (customText?: string) => {
    const userMsg = (customText ?? input).trim();
    if (!userMsg || loading) return;

    if (!customText) setInput("");
    const activeSubjLabel =
      SUBJECT_NODES.find((s) => s.id === selectedSubject)?.label || "🌐 Tự động";

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMsg,
        nodeInfo: activeSubjLabel + " • " + selectedGrade,
      },
    ]);

    // Kiểm tra Bộ nhớ đệm Lượng tử ngay trên trình duyệt (0ms)
    const clientCacheKey =
      selectedSubject + "|" + selectedGrade + "|" + selectedModel + "|" + userMsg.toLowerCase();
    const cachedHit = localQuantumCacheRef.current.get(clientCacheKey);
    if (cachedHit) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: cachedHit.reply,
          nodeInfo: cachedHit.nodeInfo + " • ⚡ Cache Lượng Tử",
          latencyMs: 5,
        },
      ]);
      return;
    }

    setLoading(true);
    const startTime = performance.now();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          grade: selectedGrade,
          subject: selectedSubject,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      if (data.reply) {
        const nodeBadge =
          (activeSubjLabel + " • " + selectedGrade) +
          (data.usedModel ? " • " + data.usedModel : "");
        localQuantumCacheRef.current.set(clientCacheKey, {
          reply: data.reply,
          nodeInfo: nodeBadge,
        });
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            nodeInfo: nodeBadge,
            latencyMs: elapsed,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Hệ thống đang bận, vui lòng thử lại sau giây lát!",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Có lỗi xảy ra khi kết nối với AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activePrompts = getActiveQuickPrompts();
  const currentSubjObj =
    SUBJECT_NODES.find((s) => s.id === selectedSubject) || SUBJECT_NODES[0];

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans py-4 px-3 md:px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[86vh]">
        {/* HEADER LƯỚI LƯỢNG TỬ + MENU THẢ CHỌN KHỐI LỚP & MODEL */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 p-3.5 md:p-4 text-white rounded-t-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-black text-xl shadow-md shrink-0">
              10<sup className="text-xs -top-2">+</sup>
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg leading-tight flex items-center gap-2">
                <span>iChat - Lưới Lượng Tử Đa Vũ Trụ</span>
                <span className="hidden sm:inline-block text-[11px] bg-yellow-400/20 text-yellow-300 border border-yellow-300/40 px-2 py-0.5 rounded-full font-semibold">
                  SGK Kết nối tri thức
                </span>
              </h1>
              <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
                Đang khóa tọa độ: <strong className="text-yellow-300">{currentSubjObj?.label} • {selectedGrade}</strong>
              </p>
            </div>
          </div>

          {/* BỘ ĐIỀU KHIỂN MENU THẢ: CHỌN KHỐI LỚP (6 -> 12) & CẤP ĐỘ TƯ DUY GEMINI */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Menu thả chọn Khối lớp 6 -> 12 */}
            <div className="flex items-center bg-white/15 hover:bg-white/25 border border-white/30 rounded-full px-3 py-1 transition">
              <span className="text-[11px] text-blue-100 mr-1.5 font-medium">🎓 Khối:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                title="Chọn Khối lớp (Lớp 6 đến Lớp 12)"
                className="bg-transparent text-yellow-300 text-xs font-extrabold focus:outline-none cursor-pointer"
              >
                {GRADE_LIST.map((g) => (
                  <option key={g} value={g} className="text-gray-900 font-bold">
                    {g === "Giáo sư" ? "👑 Giáo sư (IQ Vô Cực)" : g}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu thả chọn Model Gemini */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Chọn cấp độ tư duy Gemini"
              className="bg-blue-900/70 hover:bg-blue-950 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400/40 focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash-lite">⚡ 3.5 Flash-Lite (Siêu tốc)</option>
              <option value="gemini-3.8-flash">✨ 3.8 Flash (Toàn diện)</option>
              <option value="gemini-3.1-pro">🧠 3.1 Pro (Suy luận sâu)</option>
              <option value="gemini-4-argon">🚀 4 Argon (Phức tạp)</option>
            </select>
          </div>
        </div>

        {/* THANH NÚT BẤM CHỌN MÔN HỌC (QUANTUM SUBJECT NODES) */}
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-gray-200 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1 shrink-0">
            Vũ trụ môn:
          </span>
          {SUBJECT_NODES.map((subj) => {
            const isActive = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj.id)}
                className={
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 flex items-center gap-1 " +
                  (isActive
                    ? "bg-gradient-to-r " +
                      subj.color +
                      " text-white shadow-md scale-[1.03]"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-700")
                }
              >
                {subj.label}
              </button>
            );
          })}
        </div>

        {/* THANH GỢI Ý NHANH ĐỘNG THEO ĐÚNG [MÔN HỌC x KHỐI LỚP] */}
        <div className="px-3.5 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-xs font-bold text-blue-900 shrink-0">
            ⚡ Gợi ý ({selectedGrade}):
          </span>
          {activePrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs bg-white hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200 px-3 py-1 rounded-full transition shadow-2xs shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* KHU VỰC TIN NHẮN */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                "flex flex-col " +
                (msg.sender === "user" ? "items-end" : "items-start")
              }
            >
              {msg.nodeInfo && (
                <div className="text-[11px] text-gray-400 mb-1 px-1 flex items-center gap-1.5">
                  <span>{msg.nodeInfo}</span>
                  {typeof msg.latencyMs === "number" && (
                    <span className="text-emerald-600 font-semibold">
                      • {(msg.latencyMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>
              )}
              <div
                className={
                  "max-w-[88%] rounded-2xl p-4 shadow-sm text-sm md:text-base leading-relaxed " +
                  (msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none space-y-2")
                }
              >
                {msg.sender === "user" ? msg.text : formatAIMessage(msg.text)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-blue-100 rounded-2xl p-4 text-blue-700 text-sm flex items-center gap-2 shadow-2xs">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                <span>
                  Đang giải tại nút <strong>{currentSubjObj?.label} • {selectedGrade}</strong>...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BẢNG NHẬP TIN NHẮN */}
        <div className="p-3.5 md:p-4 bg-white border-t border-gray-100 rounded-b-2xl">
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
              placeholder={
                "Nhập câu hỏi " +
                (currentSubjObj?.label.replace(/^[^\s]+\s/, "") || "bất kỳ") +
                " (" +
                selectedGrade +
                " - SGK Kết nối tri thức) tại đây..."
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <span>Gửi</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
