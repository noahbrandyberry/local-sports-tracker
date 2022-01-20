import { call, put, takeLatest } from 'redux-saga/effects';
import { LocationActionTypes } from './models';
import { fetchLocationSuccess, fetchLocationError } from './actions';
import GetLocation, { Location } from 'react-native-get-location';

function* fetchLocation() {
  try {
    const data: Location = yield call(GetLocation.getCurrentPosition, {
      enableHighAccuracy: true,
      timeout: 15000,
    });
    yield put(fetchLocationSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(fetchLocationError(e));
  }
}

export default function* allLocationSagas() {
  yield takeLatest(LocationActionTypes.FETCH_LOCATION, fetchLocation);
}
