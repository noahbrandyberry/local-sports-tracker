export enum DeviceTokenActionTypes {
  SAVE_DEVICE_TOKEN = 'SAVE_DEVICE_TOKEN',
  SAVE_DEVICE_TOKEN_SUCCESS = 'SAVE_DEVICE_TOKEN_SUCCESS',
  SAVE_DEVICE_TOKEN_ERROR = 'SAVE_DEVICE_TOKEN_ERROR',
}

export interface SaveDeviceTokenRequest {
  device_token: string;
  device_subscriptions_attributes?: DeviceSubscriptionRequest[];
}

export interface DeviceSubscriptionRequest extends DeviceSubscription {
  _destroy?: boolean;
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
  device_token: string;
  device_subscriptions: DeviceSubscription[];
}

export interface DeviceSubscription {
  id?: number;
  subscribable_id?: string;
  subscribable_type?: string;
}

export type DeviceTokenAction =
  | SaveDeviceToken
  | SaveDeviceTokenSuccess
  | SaveDeviceTokenError;
