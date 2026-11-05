export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error';

export interface DeviceInfo {
  deviceId: string;
  label: string;
}

export interface CameraState {
  status: CameraStatus;
  stream: MediaStream | null;
  devices: DeviceInfo[];
  selectedDeviceId: string | null;
  error: string | null;
}
