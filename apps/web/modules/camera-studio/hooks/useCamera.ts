// @ts-nocheck
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { CameraState, CameraStatus, DeviceInfo } from '../types';

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    status: 'idle',
    stream: null,
    devices: [],
    selectedDeviceId: null,
    error: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const stopStream = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
  }, [state.stream]);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${state.devices.length + 1}`,
        }));
      setState((prev) => ({ ...prev, devices: videoDevices }));
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  }, [state.devices.length]);

  const startCamera = useCallback(async (deviceId?: string) => {
    stopStream();
    setState((prev) => ({ ...prev, status: 'requesting', error: null }));

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setState((prev) => ({
        ...prev,
        status: 'active',
        stream,
        selectedDeviceId: deviceId || stream.getVideoTracks()[0]?.getSettings().deviceId || null,
      }));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Refresh devices list to get labels after permission granted
      await getDevices();
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err.message || 'Could not access camera',
      }));
    }
  }, [stopStream, getDevices]);

  const switchCamera = useCallback((deviceId: string) => {
    startCamera(deviceId);
  }, [startCamera]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return null;
  }, []);

  return {
    ...state,
    videoRef,
    startCamera,
    stopStream,
    switchCamera,
    takePhoto,
  };
};
