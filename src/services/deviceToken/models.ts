export enum DeviceTokenActionTypes {
  SAVE_DEVICE_TOKEN = 'SAVE_DEVICE_TOKEN',
  SAVE_DEVICE_TOKEN_SUCCESS = 'SAVE_DEVICE_TOKEN_SUCCESS',
  SAVE_DEVICE_TOKEN_ERROR = 'SAVE_DEVICE_TOKEN_ERROR',
}

export interface SaveDeviceTokenRequest {
  deviceToken: string;
}

export interface SaveDeviceToken {
  type: typeof DeviceTokenActionTypes.SAVE_DEVICE_TOKEN;
  data: SaveDeviceTokenRequest;
}

export interface SaveDeviceTokenSuccess {
  type: typeof DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_SUCCESS;
  payload: DeviceToken;
}

export interface SaveDeviceTokenError {
  type: typeof DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_ERROR;
  error: Error;
}

export interface DeviceToken {
  id: number;
  device_token: string;
}

export type DeviceTokenAction =
  | SaveDeviceToken
  | SaveDeviceTokenSuccess
  | SaveDeviceTokenError;
