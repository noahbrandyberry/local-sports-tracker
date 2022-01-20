import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { LocationActionTypes } from './models'
import { fetchLocationSuccess, fetchLocationError } from './actions'
import GetLocation from 'react-native-get-location'

function* fetchLocation() {
  try {
    const data = yield call(GetLocation.getCurrentPosition, {enableHighAccuracy: true, timeout: 15000})
    yield put(fetchLocationSuccess(data));
  } catch (e) {
    console.log(e)
    console.log({...e})
    yield put(fetchLocationError(e));
  }
}


export default function* allLocationSagas() {
  yield all([
    yield takeLatest(LocationActionTypes.FETCH_LOCATION, fetchLocation)
  ])
}