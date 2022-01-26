import {
  DeviceToken,
  DeviceTokenActionTypes,
  SaveDeviceTokenRequest,
} from './models';

export const saveDeviceToken = (data: SaveDeviceTokenRequest) => ({
  type: DeviceTokenActionTypes.SAVE_DEVICE_TOKEN,
  data,
});

export const saveDeviceTokenSuccess = (data: DeviceToken) => ({
  type: DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_SUCCESS,
  payload: data,
});

export const saveDeviceTokenError = (error: Error) => ({
  type: DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_ERROR,
  error: error,
});
