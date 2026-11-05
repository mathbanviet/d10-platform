"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Layers,
  FileImage,
  Download,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function PDFStudioPage() {
  const [activeTab, setActiveTab] = useState<"split" | "merge" | "img2pdf">("split");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  
  // Thông số Cắt PDF (Split)
  const [pageCount, setPageCount] = useState<number>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string>("");

  // 1. Xử lý khi chọn file để Cắt (Split)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setResultUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setStartPage(1);
      setEndPage(count);
    } catch (err) {
      alert("Không thể đọc file PDF này. Vui lòng chọn file khác.");
    }
  };

  // Thực hiện Cắt PDF
  const handleSplitPDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const startIndex = Math.max(0, startPage - 1);
      const endIndex = Math.min(pageCount - 1, endPage - 1);

      const indices = [];
      for (let i = startIndex; i <= endIndex; i++) {
        indices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultName(`cat-trang-${startPage}-den-${endPage}-${selectedFile.name}`);
    } catch (err) {
      alert("Lỗi khi cắt file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Xử lý Gộp nhiều file PDF (Merge)
  const handleMergeFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setMergeFiles((prev) => [...prev, ...files]);
    setResultUrl(null);
  };

  const handleMergePDF = async () => {
    if (mergeFiles.length < 2) {
      alert("Vui lòng chọn ít nhất 2 file PDF để gộp.");
      return;
    }
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultName(`gop-${mergeFiles.length}-file-diem10.pdf`);
    } catch (err) {
      alert("Lỗi khi gộp file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Xử lý Ảnh sang PDF (Image to PDF)
  const handleImgFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImgFiles((prev) => [...prev, ...files]);
    setResultUrl(null);
  };

  const handleImagesToPDF = async () => {
    if (imgFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of imgFiles) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultName(`anh-chup-bai-tap-${Date.now()}.pdf`);
    } catch (err) {
      alert("Lỗi khi chuyển ảnh sang PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Thanh tiêu đề & Nút quay lại */}
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Link
            href="/apps-new"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Kho Ứng Dụng</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Xử lý 100% trên trình duyệt - Bảo mật tuyệt đối</span>
          </div>
        </div>

        {/* Header giới thiệu */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
            <Scissors className="w-8 h-8 text-red-500" />
            <span>iLovePDF Điểm 10+ Studio</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Công cụ hỗ trợ giáo viên và học sinh cắt đề cương, gộp tài liệu và chuyển ảnh bài tập thành PDF siêu tốc.
          </p>
        </div>

        {/* Các Tab chức năng */}
        <div className="grid grid-cols-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab("split");
              setResultUrl(null);
            }}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "split"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Cắt trang PDF</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("merge");
              setResultUrl(null);
            }}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "merge"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gộp file PDF</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("img2pdf");
              setResultUrl(null);
            }}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "img2pdf"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>Ảnh sang PDF</span>
          </button>
        </div>

        {/* KHU VỰC THỰC THI CHÍNH */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
          {/* TAB 1: CẮT PDF */}
          {activeTab === "split" && (
            <div className="flex flex-col gap-6">
              {!selectedFile ? (
                <label className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-950/40 transition">
                  <div className="p-4 rounded-full bg-red-500/20 text-red-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-sm text-white">Chọn file PDF cần cắt trang</span>
                  <span className="text-xs text-slate-400">Hỗ trợ mọi file đề cương, tài liệu học tập</span>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="font-bold text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-emerald-400">Tổng số trang: {pageCount}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setResultUrl(null);
                      }}
                      className="p-2 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Cắt từ trang số:</label>
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={startPage}
                        onChange={(e) => setStartPage(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Đến trang số:</label>
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={endPage}
                        onChange={(e) => setEndPage(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSplitPDF}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-sm shadow-lg shadow-red-600/30 transition disabled:opacity-50"
                  >
                    {isProcessing ? "Đang xử lý cắt file..." : "Cắt & Trích xuất file PDF"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GỘP PDF */}
          {activeTab === "merge" && (
            <div className="flex flex-col gap-6">
              <label className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-950/40 transition">
                <div className="p-4 rounded-full bg-red-500/20 text-red-400">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="font-bold text-sm text-white">Chọn nhiều file PDF để gộp</span>
                <span className="text-xs text-slate-400">Chọn từ 2 file trở lên</span>
                <input type="file" accept="application/pdf" multiple onChange={handleMergeFilesChange} className="hidden" />
              </label>

              {mergeFiles.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Đã chọn {mergeFiles.length} file:</span>
                    <button onClick={() => setMergeFiles([])} className="text-xs text-red-400 hover:underline">
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {mergeFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                        <span>{idx + 1}. {f.name}</span>
                        <span className="text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleMergePDF}
                    disabled={isProcessing || mergeFiles.length < 2}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-sm shadow-lg shadow-red-600/30 transition disabled:opacity-50"
                  >
                    {isProcessing ? "Đang gộp file..." : "Gộp toàn bộ thành 1 file PDF"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ẢNH SANG PDF */}
          {activeTab === "img2pdf" && (
            <div className="flex flex-col gap-6">
              <label className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-950/40 transition">
                <div className="p-4 rounded-full bg-red-500/20 text-red-400">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="font-bold text-sm text-white">Chọn ảnh chụp bài tập (JPG, PNG)</span>
                <span className="text-xs text-slate-400">Chuyển ảnh vở viết thành file PDF nộp cho giáo viên</span>
                <input type="file" accept="image/png, image/jpeg" multiple onChange={handleImgFilesChange} className="hidden" />
              </label>

              {imgFiles.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-400">Đã chọn {imgFiles.length} ảnh:</span>
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {imgFiles.map((img, idx) => (
                      <div key={idx} className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                        <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleImagesToPDF}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-sm shadow-lg shadow-red-600/30 transition disabled:opacity-50"
                  >
                    {isProcessing ? "Đang tạo file PDF..." : "Chuyển ảnh thành file PDF"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* KẾT QUẢ TẢI VỀ */}
          {resultUrl && (
            <div className="mt-4 p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="font-bold text-sm text-emerald-300">Xử lý file thành công!</p>
                  <p className="text-xs text-slate-300 mt-0.5">{resultName}</p>
                </div>
              </div>
              <a
                href={resultUrl}
                download={resultName}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tải PDF về máy</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}