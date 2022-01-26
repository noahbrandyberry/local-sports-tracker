import {
  DeviceTokenAction,
  DeviceTokenActionTypes,
  DeviceToken,
} from './models';

export interface DeviceTokenState {
  deviceToken: DeviceToken | null;
  loading: boolean;
  error: Error | null;
}

const initialState = {
  deviceToken: null,
  loading: true,
  error: null,
};

export const deviceTokenReducer = (
  state: DeviceTokenState = initialState,
  action: DeviceTokenAction,
) => {
  switch (action.type) {
    case DeviceTokenActionTypes.SAVE_DEVICE_TOKEN: {
      return { ...state, error: null, loading: true };
    }
    case DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_SUCCESS: {
      return { ...state, deviceToken: action.payload, loading: false };
    }
    case DeviceTokenActionTypes.SAVE_DEVICE_TOKEN_ERROR: {
      return { ...state, error: action.error, loading: false };
    }
    default:
      return state;
  }
};
