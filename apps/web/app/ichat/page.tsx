```tsx
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

const QUICK_PROMPTS = [
  "Toán 12 (KNTT): Khảo sát và vẽ đồ thị hàm số y = x^3 - 3x + 1",
  "Hóa 12 (KNTT): Viết phương trình thủy phân tinh bột thành glucose",
  "Vật lí 12 (KNTT): Công thức định luật 1 nhiệt động lực học và ví dụ",
  "Sinh 12 (KNTT): Giải bài tập quy luật phân li độc lập của Mendel",
  "Ngữ văn 12 (KNTT): Dàn ý nghị luận xã hội 200 chữ về bản lĩnh tuổi trẻ",
  "Tiếng Anh (Global Success): 5 câu trắc nghiệm phát âm -ed và -s/-es có giải thích",
];

export default function IChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Xin chào! Em là Trợ lý AI của Điểm 10⁺ (chuẩn SGK Kết nối tri thức với cuộc sống từ Lớp 6 đến Lớp 12). Thầy/Cô hoặc các em học sinh cần soạn bài giảng, giải bài tập Toán, Lý, Hóa, Sinh, KHTN, Ngữ văn hay Tiếng Anh hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setKatexTick] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Nạp KaTeX + gói Hóa học mhchem từ Cloudflare CDN (ổn định và không bị chặn tại VN)
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

  // Hàm tính giá trị biểu thức y = f(x)
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

    // Bộ chuyển đổi công thức Toán - Lý - Hóa - Sinh sang HTML đẹp mắt (kể cả khi không có CDN hoặc ngoặc lồng nhau)
    const convertLatexToRichHtml = (inputTex: string): string => {
      let s = escapeHtml(inputTex.trim());

      // Bước 1: Gỡ nhiều tầng các lệnh bọc chữ \text{...}, \mathrm{...}, \ce{...}, \textbf{...}
      for (let i = 0; i < 5; i++) {
        s = s.replace(
          /\\(?:text|mathrm|textbf|textit|mathit|mathbf|ce|pu)\{([^{}]*)\}/g,
          "$1"
        );
      }

      // Bước 2: Chuẩn hóa ký hiệu độ (t^o, ^\circ) TRƯỚC khi dựng mũi tên
      s = s
        .replace(/\^\{?\s*\\circ\s*\}?/g, "°")
        .replace(/\bt\^\{?o\}?\b/g, "t°")
        .replace(/\\degree/g, "°");

      // Bước 3: Dựng mũi tên phản ứng hóa học \xrightarrow[dưới]{trên} và \xrightarrow{trên}
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

      // Bước 4: Dựng phân số thẳng đứng chuẩn \dfrac{tử}{mẫu} (hỗ trợ phân số lồng nhau)
      for (let i = 0; i < 3; i++) {
        s = s.replace(
          /\\(?:d?frac|tfrac)\{([^{}]+)\}\{([^{}]+)\}/g,
          '<span class="inline-flex flex-col items-center align-middle mx-1 text-[0.95em] leading-tight"><span class="border-b border-current px-1 pb-0.5">$1</span><span class="px-1 pt-0.5">$2</span></span>'
        );
      }

      // Bước 5: Dựng căn bậc hai / bậc n và vectơ / góc
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

      // Bước 6: Thay thế các toán tử Toán - Lý - Hóa - Sinh phổ biến
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

      // Bước 7: Chuyển đổi chỉ số trên ^{...}, ^x và chỉ số dưới _{...}, _x (H₂O, C₆H₁₂O₆, x²)
      s = s
        .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
        .replace(/\^([0-9a-zA-Z+\-°]+)/g, "<sup>$1</sup>")
        .replace(/\_\{([^{}]+)\}/g, "<sub>$1</sub>")
        .replace(/\_([0-9a-zA-Z+\-]+)/g, "<sub>$1</sub>");

      // Bước 8: Dọn sạch các dấu ngoặc nhọn { } hoặc lệnh \ thừa còn sót lại
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

      // Nếu KaTeX đã sẵn sàng VÀ biểu thức không chứa tiếng Việt có dấu trong \xrightarrow gây lỗi font
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
          // Chuyển ngay sang bộ dựng HTML chất lượng cao bên dưới nếu KaTeX báo lỗi
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
      const id = "@@BLOCK_" + String(specialBlocks.length) + "@@";
      specialBlocks.push(html);
      return id;
    };

    // 0. Bảo vệ thẻ gạch chân <u>...</u> cho bài tập phát âm Tiếng Anh
    let processed = rawText.replace(/<u>([\s\S]*?)<\/u>/gi, (_, content) =>
      saveBlock(
        '<u class="decoration-2 decoration-blue-700 underline-offset-4 font-bold text-blue-900">' +
          escapeHtml(String(content)) +
          "</u>"
      )
    );

    // 1. Tách khối vẽ đồ thị ```graph ... ```
    processed = processed.replace(
      /\x60\x60\x60graph\s*([\s\S]*?)\x60\x60\x60/gi,
      (_, json) => {
        const graphHtml = renderFunctionGraph(String(json));
        return graphHtml ? "\n" + saveBlock(graphHtml) + "\n" : "";
      }
    );

    // 2. Tách khối vẽ hình học 2D/3D ```geo ... ```
    processed = processed.replace(
      /\x60\x60\x60geo\s*([\s\S]*?)\x60\x60\x60/gi,
      (_, json) => {
        const geoHtml = renderGeometryBlock(String(json));
        return geoHtml ? "\n" + saveBlock(geoHtml) + "\n" : "";
      }
    );

    // 3. Tách khối hình SVG ```svg ... ```
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

    // 4. Tách công thức lớn $$...$$ và \[...\]
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

    // 5. Tách công thức nhỏ nằm trên cùng dòng $...$ và \(...\)
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, tex) =>
      saveBlock(renderMath(String(tex), false))
    );
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) =>
      saveBlock(renderMath(String(tex), false))
    );

    // 6. LƯỚI BẢO VỆ CHỐNG LỘ MÃ LATEX (Khi AI quên bọc dấu $...$):
    // 6a. Nếu cả dòng là phương trình phản ứng có \xrightarrow hoặc \xrightleftharpoons mà AI quên bọc $$
    processed = processed.replace(
      /^([^\n]*(?:\\xrightarrow|\\xrightleftharpoons)[^\n]*)$/gm,
      (line) => {
        if (line.includes("@@BLOCK_")) return line;
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

    // 6b. Nếu trong ngoặc đơn (...) chứa mã LaTeX trần như (\text{C}_6\text{H}_{12}\text{O}_6)
    processed = processed.replace(
      /\(([^()\n]*\\(?:text|mathrm|ce|dfrac|frac|sqrt|rightarrow|to)[^()\n]*)\)/g,
      (_, innerTex) => {
        if (String(innerTex).includes("@@BLOCK_")) return "(" + innerTex + ")";
        return "(" + saveBlock(renderMath(String(innerTex), false)) + ")";
      }
    );

    // 6c. Quét các lệnh LaTeX rời rạc còn sót lại ngoài dấu $ (như \text{C}_6\text{H}_{12}\text{O}_6, \dfrac{a}{b}, C_6H_{12}O_6)
    processed = processed.replace(
      /(?:\\(?:text|mathrm|ce)\{[^{}]+\}|\\(?:d?frac)\{[^{}]+\}\{[^{}]+\}|\\sqrt\{[^{}]+\}|[A-Z][a-z]?(?:_\{?\d+\}?|\^\{?[0-9+\-]+}?)+)+/g,
      (match) => {
        if (match.includes("@@BLOCK_")) return match;
        return saveBlock(renderMath(match, false));
      }
    );

    // Tự động ngắt dòng với các dấu --- hoặc tiêu đề ### bị viết liền
    processed = processed
      .replace(/\s+---\s+/g, "\n---\n")
      .replace(/\s+(#{2,4}\s+)/g, "\n$1");

    // Làm sạch HTML, định dạng chữ và đưa dấu + của 10+ lên làm số mũ
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

    // Tách dòng và tự động gom các dòng có dấu |...| thành Bảng kẻ ô (Table)
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

    // Khôi phục khối Đồ thị, Hình học 2D/3D và Công thức Toán/Lý/Hóa/Sinh vào từng dòng/bảng
    return groupedBlocks.map((block, i) => {
      const restoredBlock = block.replace(
        /@@BLOCK_(\d+)@@/g,
        (_, bIdx) => specialBlocks[Number(bIdx)] || ""
      );
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
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    // Tự động lấy Khối lớp của học sinh đã đăng nhập (nếu có) để AI giải đúng lớp
    let savedGrade = "";
    try {
      const savedProfile = localStorage.getItem("d10_user_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.grade) savedGrade = String(parsed.grade);
      }
    } catch {
      // Bỏ qua nếu chưa đăng nhập
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, grade: savedGrade }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
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

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans py-6 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[82vh]">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 text-white rounded-t-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-black text-xl shadow-md">
              10<sup className="text-xs -top-2">+</sup>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                iChat - Trợ lý Hỏi đáp AI (Lớp 6 - 12)
              </h1>
              <p className="text-xs text-blue-100 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
                Chuẩn SGK Kết nối tri thức với cuộc sống • Hỗ trợ 24/7
              </p>
            </div>
          </div>
          <span className="bg-blue-800/60 text-xs px-3 py-1 rounded-full border border-blue-400/30">
            10 Plus AI
          </span>
        </div>

        {/* THANH GỢI Ý NHANH CÁC MÔN HỌC */}
        <div className="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-xs font-semibold text-blue-800 shrink-0">
            Gợi ý nhanh:
          </span>
          {QUICK_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs bg-white hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 px-3 py-1 rounded-full transition shadow-2xs shrink-0 disabled:opacity-50"
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
                "flex " +
                (msg.sender === "user" ? "justify-end" : "justify-start")
              }
            >
              <div
                className={
                  "max-w-[85%] rounded-2xl p-4 shadow-sm text-sm md:text-base leading-relaxed " +
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
              <div className="bg-white border border-gray-100 rounded-2xl p-4 text-gray-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span>iChat đang biên soạn câu trả lời...</span>
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
              placeholder="Nhập câu hỏi Toán, Lý, Hóa, Sinh, KHTN, Văn, Anh (Lớp 6 - 12) hoặc yêu cầu soạn bài..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:border-blue-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
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
```