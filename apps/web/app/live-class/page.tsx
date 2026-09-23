"use client";

import { JitsiMeeting } from '@jitsi/react-sdk';
import Link from 'next/link';
import { useState } from 'react';

export default function LiveClassPage() {
  const [isJoined, setIsJoined] = useState(false);
  
  // Tên phòng học (có thể tạo tự động dựa vào mã lớp học)
  const roomName = "Diem10Plus_Toan12_Bai1";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      
      {/* THANH HEADER */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-lg">Lớp Toán 12 - Thầy Phúc Huy</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Đang diễn ra
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
            Tài liệu buổi học
          </button>
        </div>
      </div>

      {/* KHU VỰC PHÒNG HỌC VIDEO */}
      <div className="flex-1 w-full flex items-center justify-center bg-black relative">
        {!isJoined ? (
          <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
            <div className="w-20 h-20 bg-blue-900/50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Đã sửa lại lỗi dư thẻ đóng </path> ở đây */}
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Chuẩn bị vào lớp</h2>
            <p className="text-gray-400 mb-8">Vui lòng kiểm tra lại camera và micro trước khi tham gia lớp học Toán 12.</p>
            <button 
              onClick={() => setIsJoined(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition text-lg shadow-lg shadow-blue-900/20"
            >
              Tham gia ngay
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={roomName}
              configOverwrite={{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false,
                prejoinPageEnabled: false
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                SHOW_CHROME_EXTENSION_BANNER: false,
                TOOLBAR_BUTTONS: [
                  'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                  'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                  'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                  'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
                ]
              }}
              userInfo={{
                displayName: 'Học sinh Điểm 10+',
                email: 'hocsinh@diem10.edu.vn' // Đã bổ sung biến email để hết lỗi TypeScript
              }}
              getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}