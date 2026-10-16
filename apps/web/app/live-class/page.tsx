"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface ChatItem {
  sender: string;
  text: string;
  time: string;
}

interface RemotePeerStream {
  peerId: string;
  displayName: string;
  stream: MediaStream;
  isVideo: boolean;
}

declare global {
  interface Window {
    Peer?: any;
  }
}

const MAX_MESH_SLOTS = 6;

const PRESET_CLASSES = [
  {
    code: "TOAN12-THAY-HUY",
    title: "Lớp Toán 12 - Thầy Phúc Huy",
    jitsiRoom: "Diem10Plus_Toan12_ThayPhucHuy",
  },
  {
    code: "TOAN9-LUYEN-THI-10",
    title: "Lớp Toán 9 Ôn thi vào 10 - Thầy Phúc Huy",
    jitsiRoom: "Diem10Plus_Toan9_OnThiVao10",
  },
  {
    code: "KHTN-LY-HOA-SINH",
    title: "Lớp Lý - Hóa - KHTN Điểm 10⁺",
    jitsiRoom: "Diem10Plus_KHTN_LyHoaSinh",
  },
  {
    code: "TIN-HOC-PYTHON-SCRATCH",
    title: "Lớp Tin học & Lập trình (Scratch / Python)",
    jitsiRoom: "Diem10Plus_TinHoc_LapTrinh",
  },
  {
    code: "TU-VAN-1-1",
    title: "Phòng Tư vấn & Gia sư 1-1 Điểm 10⁺",
    jitsiRoom: "Diem10Plus_TuVan_GiaSu",
  },
];

export default function LiveClassPage() {
  // 2 chế độ:
  // - "jitsi": Phòng học lớn dùng @jitsi/react-sdk có sẵn của dự án (30 - 100 học sinh)
  // - "peerjs": Gọi trực tiếp Web-qua-Web 1-1 & Nhóm nhỏ (2 - 6 người) bằng PeerJS
  const [mode, setMode] = useState<"peerjs" | "jitsi">("peerjs");
  const [isJoinedJitsi, setIsJoinedJitsi] = useState(false);

  const [roomCode, setRoomCode] = useState("TOAN12-THAY-HUY");
  const [userName, setUserName] = useState("Học sinh Điểm 10⁺");
  const [myPeerId, setMyPeerId] = useState("");
  const [directTargetId, setDirectTargetId] = useState("");
  const [statusText, setStatusText] = useState("Sẵn sàng kết nối");
  const [inCall, setInCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [remoteStreams, setRemoteStreams] = useState<RemotePeerStream[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([
    {
      sender: "Hệ thống Điểm 10⁺",
      text: "Chào mừng bạn! Chọn lớp học và bấm Gọi thoại hoặc Gọi video để kết nối trực tiếp, hoặc chuyển sang chế độ Phòng Học Jitsi cho lớp đông người.",
      time: "Bây giờ",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<any>(null);
  const activeCallsRef = useRef<Map<string, any>>(new Map());
  const dataConnsRef = useRef<Map<string, any>>(new Map());

  // 1. Tự động đồng bộ Họ tên học sinh từ AuthModal (localStorage) và đọc mã phòng từ link ?room=...
  useEffect(() => {
    try {
      const saved = localStorage.getItem("d10_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.fullName) {
          setUserName(
            parsed.fullName + (parsed.grade ? " - " + parsed.grade : "")
          );
        }
      }
    } catch {
      // Bỏ qua nếu chưa đăng nhập
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      const modeParam = params.get("mode");
      if (roomParam && roomParam.trim()) {
        setRoomCode(roomParam.trim().toUpperCase());
      }
      if (modeParam === "jitsi" || modeParam === "peerjs") {
        setMode(modeParam);
      }
    }
  }, []);

  // 2. Nạp thư viện PeerJS từ CDN cho chế độ Gọi Web-to-Web
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.Peer &&
      !document.getElementById("peerjs-cdn")
    ) {
      const script = document.createElement("script");
      script.id = "peerjs-cdn";
      script.src = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
    return () => {
      hangUpAll();
    };
  }, []);

  const normalizeRoomKey = (raw: string) =>
    raw
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "TOAN12-THAY-HUY";

  const activePreset = PRESET_CLASSES.find(
    (c) => c.code === normalizeRoomKey(roomCode)
  );
  const currentClassTitle =
    activePreset?.title || "Lớp học: " + normalizeRoomKey(roomCode);
  const currentJitsiRoomName =
    activePreset?.jitsiRoom ||
    "Diem10Plus_" + normalizeRoomKey(roomCode).replace(/-/g, "_");

  const addRemoteStream = (
    peerId: string,
    displayName: string,
    stream: MediaStream,
    isVideo: boolean
  ) => {
    setRemoteStreams((prev) => {
      const filtered = prev.filter((item) => item.peerId !== peerId);
      return [...filtered, { peerId, displayName, stream, isVideo }];
    });
  };

  const removeRemoteStream = (peerId: string) => {
    setRemoteStreams((prev) => prev.filter((item) => item.peerId !== peerId));
    activeCallsRef.current.delete(peerId);
    dataConnsRef.current.delete(peerId);
  };

  const setupDataConnection = (conn: any) => {
    conn.on("open", () => {
      dataConnsRef.current.set(conn.peer, conn);
    });
    conn.on("data", (data: any) => {
      if (data && data.type === "chat") {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: String(data.sender || "Thành viên"),
            text: String(data.text || ""),
            time: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    });
    conn.on("close", () => {
      dataConnsRef.current.delete(conn.peer);
    });
  };

  const bindMediaCall = (call: any, defaultName: string) => {
    activeCallsRef.current.set(call.peer, call);
    const callerName = call.metadata?.userName || defaultName || call.peer;
    const callIsVideo = call.metadata?.video !== false;

    call.on("stream", (remoteStream: MediaStream) => {
      addRemoteStream(call.peer, callerName, remoteStream, callIsVideo);
    });
    call.on("close", () => {
      removeRemoteStream(call.peer);
    });
    call.on("error", () => {
      removeRemoteStream(call.peer);
    });
  };

  // Bắt đầu Gọi Thoại hoặc Gọi Video (Tự động ghép phòng 1-1 & Nhóm nhỏ tới 6 người)
  const startCall = async (withVideo: boolean) => {
    if (!window.Peer) {
      alert("Đang khởi tạo kết nối PeerJS, vui lòng bấm lại sau 1 giây!");
      return;
    }

    hangUpAll();
    setIsVideoCall(withVideo);
    setCamEnabled(withVideo);
    setMicEnabled(true);
    setStatusText("Đang mở Micro / Camera...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setInCall(true);

      const cleanRoom = normalizeRoomKey(roomCode);
      const iceConfig = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      };

      const tryClaimSlot = (slotIndex: number) => {
        if (slotIndex > MAX_MESH_SLOTS) {
          setStatusText(
            "Phòng gọi nhanh đã đủ 6 người! Vui lòng chuyển sang nút Phòng Học Lớn (Jitsi)."
          );
          return;
        }

        const candidateId = "D10-" + cleanRoom + "-S" + String(slotIndex);
        setStatusText(
          "Đang kết nối phòng " + cleanRoom + " (Vị trí #" + slotIndex + ")..."
        );

        const peerInstance = new window.Peer(candidateId, {
          config: iceConfig,
        });

        peerInstance.on("open", (assignedId: string) => {
          peerRef.current = peerInstance;
          setMyPeerId(assignedId);
          setStatusText(
            "Đang trực tuyến tại " + cleanRoom + " (Vị trí #" + slotIndex + ")"
          );

          // Tự động kết nối đến tất cả thành viên khác đang có mặt trong cùng phòng
          for (let s = 1; s <= MAX_MESH_SLOTS; s++) {
            if (s === slotIndex) continue;
            const targetPeerId = "D10-" + cleanRoom + "-S" + String(s);

            const outCall = peerInstance.call(targetPeerId, stream, {
              metadata: { userName, video: withVideo },
            });
            if (outCall) {
              bindMediaCall(outCall, "Thành viên #" + s);
            }

            const outConn = peerInstance.connect(targetPeerId, {
              metadata: { userName },
            });
            if (outConn) {
              setupDataConnection(outConn);
            }
          }
        });

        // Tự động nhận cuộc gọi từ thành viên cùng phòng (hoặc hỏi xác nhận nếu gọi bằng ID ngoài)
        peerInstance.on("call", (incomingCall: any) => {
          incomingCall.answer(stream);
          bindMediaCall(
            incomingCall,
            incomingCall.metadata?.userName || "Thành viên"
          );
        });

        peerInstance.on("connection", (incomingConn: any) => {
          setupDataConnection(incomingConn);
        });

        peerInstance.on("error", (err: any) => {
          if (err && err.type === "unavailable-id") {
            peerInstance.destroy();
            tryClaimSlot(slotIndex + 1);
          } else {
            console.warn("PeerJS Notice:", err?.type || err);
          }
        });
      };

      tryClaimSlot(1);
    } catch (err: any) {
      setStatusText("Lỗi thiết bị: " + (err?.message || "Không mở được Mic/Cam"));
      alert(
        "Không lấy được microphone/camera: Vui lòng cấp quyền truy cập Micro & Camera trên trình duyệt!"
      );
    }
  };

  // Gọi trực tiếp bằng ID người nhận (như trong tài liệu hướng dẫn PeerJS)
  const callByDirectId = () => {
    const target = directTargetId.trim();
    if (!target) {
      alert("Vui lòng nhập ID người nhận!");
      return;
    }
    if (!peerRef.current || !localStreamRef.current) {
      alert("Hãy bấm Gọi thoại hoặc Gọi video để bật thiết bị trước khi gọi ID!");
      return;
    }
    const outCall = peerRef.current.call(target, localStreamRef.current, {
      metadata: { userName, video: isVideoCall },
    });
    if (outCall) {
      bindMediaCall(outCall, target);
    }
    const outConn = peerRef.current.connect(target, { metadata: { userName } });
    if (outConn) {
      setupDataConnection(outConn);
    }
    setDirectTargetId("");
  };

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !micEnabled;
    });
    setMicEnabled(!micEnabled);
  };

  const toggleCam = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !camEnabled;
    });
    setCamEnabled(!camEnabled);
  };

  const toggleScreenShare = async () => {
    if (!inCall || !localStreamRef.current) return;

    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = displayStream.getVideoTracks()[0];
        if (!screenTrack) return;

        activeCallsRef.current.forEach((call) => {
          const sender = call.peerConnection
            ?.getSenders()
            ?.find((s: any) => s.track && s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = displayStream;
        }
        setScreenSharing(true);
        screenTrack.onended = () => stopScreenShare();
      } catch {
        // Hủy chia sẻ màn hình
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack) {
      activeCallsRef.current.forEach((call) => {
        const sender = call.peerConnection
          ?.getSenders()
          ?.find((s: any) => s.track && s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(camTrack);
        }
      });
    }
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setScreenSharing(false);
  };

  const hangUpAll = () => {
    activeCallsRef.current.forEach((call) => {
      try {
        call.close();
      } catch {}
    });
    activeCallsRef.current.clear();

    dataConnsRef.current.forEach((conn) => {
      try {
        conn.close();
      } catch {}
    });
    dataConnsRef.current.clear();

    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch {}
      peerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setRemoteStreams([]);
    setInCall(false);
    setScreenSharing(false);
    setMyPeerId("");
    setStatusText("Sẵn sàng kết nối");
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg) return;

    const timeNow = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setChatMessages((prev) => [
      ...prev,
      { sender: userName + " (Bạn)", text: msg, time: timeNow },
    ]);

    dataConnsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send({ type: "chat", sender: userName, text: msg });
      }
    });

    setChatInput("");
  };

  const copyInviteLink = () => {
    if (typeof window === "undefined") return;
    const cleanRoom = normalizeRoomKey(roomCode);
    const url =
      window.location.origin +
      "/live-class?room=" +
      encodeURIComponent(cleanRoom) +
      "&mode=" +
      mode;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-white">
      {/* THANH HEADER (Giữ nguyên phong cách gốc của Thầy + Nâng cấp chọn chế độ) */}
      <div className="bg-gray-800 text-white px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-10 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => hangUpAll()}
            className="text-gray-400 hover:text-white transition"
            title="Về trang chủ"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">
              {currentClassTitle}
            </h1>
            <p className="text-xs text-green-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>{statusText}</span>
              {myPeerId && (
                <span className="text-yellow-300 font-semibold">
                  • ID của bạn: {myPeerId}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Cụm chuyển đổi giữa Gọi Nhanh PeerJS và Phòng Học Jitsi + Nút Tài liệu */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsJoinedJitsi(false);
                setMode("peerjs");
              }}
              className={
                "px-3 py-1.5 rounded-lg text-xs font-bold transition " +
                (mode === "peerjs"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white")
              }
            >
              ⚡ Gọi Web-to-Web (1–1 / Nhóm)
            </button>
            <button
              type="button"
              onClick={() => {
                hangUpAll();
                setMode("jitsi");
              }}
              className={
                "px-3 py-1.5 rounded-lg text-xs font-bold transition " +
                (mode === "jitsi"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-gray-400 hover:text-white")
              }
            >
              🏫 Phòng Học Jitsi (Lớp Lớn)
            </button>
          </div>

          <button
            type="button"
            onClick={copyInviteLink}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-bold text-xs transition"
          >
            {copiedLink ? "✅ Đã chép Link!" : "🔗 Copy Link Lớp"}
          </button>

          <a
            href="https://d10hub.io.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg font-bold text-xs transition"
          >
            📚 Tài liệu buổi học
          </a>
        </div>
      </div>

      {/* THANH CÔNG CỤ CHỌN LỚP & NÚT GỌI THOẠI / GỌI VIDEO / CÚP MÁY */}
      <div className="bg-gray-800/70 border-b border-gray-700 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-300 font-semibold">🏫 Chọn lớp:</span>
          <select
            value={roomCode}
            disabled={inCall}
            onChange={(e) => {
              setRoomCode(e.target.value);
              setIsJoinedJitsi(false);
            }}
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-xs font-bold text-yellow-300 focus:outline-none cursor-pointer disabled:opacity-60"
          >
            {PRESET_CLASSES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.title}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-gray-900 border border-gray-600 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-gray-400 mr-1.5">Mã riêng:</span>
            <input
              type="text"
              value={roomCode}
              disabled={inCall}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="bg-transparent text-xs font-bold text-white w-28 focus:outline-none uppercase disabled:opacity-60"
              placeholder="Nhập mã..."
            />
          </div>

          <div className="flex items-center bg-gray-900 border border-gray-600 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-gray-400 mr-1.5">Tên bạn:</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-transparent text-xs font-bold text-emerald-300 w-36 focus:outline-none"
              placeholder="Nhập họ tên..."
            />
          </div>
        </div>

        {/* CỤM NÚT GỌI THOẠI / GỌI VIDEO / CÚP MÁY (Chuẩn theo tài liệu PeerJS) */}
        {mode === "peerjs" && (
          <div className="flex flex-wrap items-center gap-2">
            {!inCall ? (
              <>
                <button
                  type="button"
                  onClick={() => startCall(false)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-xs md:text-sm shadow transition cursor-pointer"
                >
                  📞 Gọi thoại
                </button>
                <button
                  type="button"
                  onClick={() => startCall(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs md:text-sm shadow transition cursor-pointer"
                >
                  🎥 Gọi video
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition " +
                    (micEnabled
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-amber-600 text-white")
                  }
                >
                  {micEnabled ? "🎙️ Tắt Mic" : "🔇 Bật Mic"}
                </button>
                <button
                  type="button"
                  onClick={toggleCam}
                  className={
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition " +
                    (camEnabled
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-amber-600 text-white")
                  }
                >
                  {camEnabled ? "📷 Tắt Cam" : "🚫 Bật Cam"}
                </button>
                <button
                  type="button"
                  onClick={toggleScreenShare}
                  className={
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition " +
                    (screenSharing
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-cyan-300")
                  }
                >
                  {screenSharing ? "🖥️ Dừng chia sẻ" : "🖥️ Chia sẻ màn hình"}
                </button>
                <button
                  type="button"
                  onClick={hangUpAll}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs md:text-sm shadow transition cursor-pointer"
                >
                  ☎️ Cúp máy
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* KHU VỰC HIỂN THỊ CHÍNH */}
      {mode === "peerjs" ? (
        <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-5 bg-gray-950">
          {/* LƯỚI VIDEO P2P (3 CỘT) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className={
                "grid gap-4 " +
                (remoteStreams.length <= 1
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")
              }
            >
              {/* Camera của bạn */}
              <div className="relative bg-black border-2 border-blue-500/60 rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!inCall && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <h4 className="font-bold text-sm text-white">
                      Camera của bạn ({userName})
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Bấm <strong>Gọi thoại</strong> hoặc <strong>Gọi video</strong> ở thanh trên để kết nối ngay
                    </p>
                  </div>
                )}
                <div className="absolute bottom-2.5 left-2.5 bg-black/70 px-3 py-1 rounded-lg text-xs font-bold text-yellow-300">
                  🟢 {userName} (Bạn) {!micEnabled ? "🔇" : ""}
                </div>
              </div>

              {/* Camera của người bên kia / các thành viên trong nhóm */}
              {remoteStreams.map((remote) => (
                <RemoteVideoTile key={remote.peerId} item={remote} />
              ))}

              {/* Khung chờ người bên kia khi chưa có ai vào */}
              {remoteStreams.length === 0 && (
                <div className="bg-gray-900/70 border-2 border-dashed border-gray-700 rounded-2xl aspect-video flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-3xl mb-2">📡</div>
                  <h4 className="font-bold text-sm text-gray-200">
                    Người bên kia / Học sinh trong phòng
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-sm leading-relaxed">
                    Chỉ cần mở trang này trên máy thứ 2, chọn cùng lớp{" "}
                    <strong className="text-yellow-300">{roomCode}</strong> rồi bấm{" "}
                    <strong>Gọi thoại / Gọi video</strong> là 2 bên tự động kết nối!
                  </p>

                  {/* Ô nhập ID người nhận thủ công (như trong tài liệu docx) */}
                  <div className="mt-4 flex items-center gap-2 w-full max-w-xs">
                    <input
                      type="text"
                      value={directTargetId}
                      onChange={(e) => setDirectTargetId(e.target.value)}
                      placeholder="Hoặc nhập ID người nhận..."
                      className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={callByDirectId}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Gọi ID
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KHUNG CHAT NHANH TRONG PHÒNG (1 CỘT) */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl flex flex-col h-[400px] lg:h-auto">
            <div className="p-3 border-b border-gray-700 font-bold text-xs text-blue-300 flex items-center justify-between">
              <span>💬 Chat trực tiếp ({remoteStreams.length + 1} người)</span>
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className="bg-gray-900/90 border border-gray-700/70 rounded-xl p-2.5"
                >
                  <div className="flex justify-between text-[11px] text-yellow-300 font-bold mb-1">
                    <span>{m.sender}</span>
                    <span className="text-gray-500 font-normal">{m.time}</span>
                  </div>
                  <div className="text-gray-200 leading-relaxed break-words">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendChat}
              className="p-2.5 border-t border-gray-700 flex gap-1.5"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập tin nhắn trao đổi bài..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* CHẾ ĐỘ 2: PHÒNG HỌC LỚN DÙNG @jitsi/react-sdk CÓ SẴN CỦA THẦY */
        <div className="flex-1 w-full flex items-center justify-center bg-black relative min-h-[75vh]">
          {!isJoinedJitsi ? (
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full m-4">
              <div className="w-20 h-20 bg-blue-900/50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Chuẩn bị vào lớp
              </h2>
              <p className="text-yellow-300 font-semibold text-sm mb-2">
                {currentClassTitle}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Bạn sẽ tham gia với tên: <strong className="text-white">{userName}</strong>. Vui lòng kiểm tra camera và micro trước khi vào lớp.
              </p>
              <button
                type="button"
                onClick={() => setIsJoinedJitsi(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition text-lg shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                Tham gia ngay
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <JitsiMeeting
                domain="meet.jit.si"
                roomName={currentJitsiRoomName}
                configOverwrite={{
                  startWithAudioMuted: false,
                  disableModeratorIndicator: true,
                  startScreenSharing: false,
                  enableEmailInStats: false,
                  prejoinPageEnabled: false,
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  SHOW_CHROME_EXTENSION_BANNER: false,
                  TOOLBAR_BUTTONS: [
                    "microphone",
                    "camera",
                    "closedcaptions",
                    "desktop",
                    "fullscreen",
                    "fodeviceselection",
                    "hangup",
                    "profile",
                    "chat",
                    "recording",
                    "livestreaming",
                    "etherpad",
                    "sharedvideo",
                    "settings",
                    "raisehand",
                    "videoquality",
                    "filmstrip",
                    "invite",
                    "feedback",
                    "stats",
                    "shortcuts",
                    "tileview",
                    "videobackgroundblur",
                    "download",
                    "help",
                    "mute-everyone",
                  ],
                }}
                userInfo={{
                  displayName: userName,
                  email: "hocsinh@diem10.edu.vn",
                }}
                getIFrameRef={(iframeRef) => {
                  iframeRef.style.height = "100%";
                  iframeRef.style.width = "100%";
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RemoteVideoTile({ item }: { item: RemotePeerStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && item.stream) {
      videoRef.current.srcObject = item.stream;
    }
  }, [item.stream]);

  return (
    <div className="relative bg-black border-2 border-green-500/60 rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2.5 left-2.5 bg-black/70 px-3 py-1 rounded-lg text-xs font-bold text-green-300">
        🟢 {item.displayName}
      </div>
    </div>
  );
}
