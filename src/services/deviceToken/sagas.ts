import { call, put, takeLatest } from 'redux-saga/effects';
import { DeviceTokenActionTypes, SaveDeviceToken } from './models';
import { saveDeviceTokenSuccess, saveDeviceTokenError } from './actions';
import { constructApiRequest } from './api';

function* saveDeviceToken(action: SaveDeviceToken) {
  try {
    const { data } = yield call(constructApiRequest, action.data);

    yield put(saveDeviceTokenSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(saveDeviceTokenError(e));
  }
}

export default function* allDeviceTokenSagas() {
  yield takeLatest(DeviceTokenActionTypes.SAVE_DEVICE_TOKEN, saveDeviceToken);
}
