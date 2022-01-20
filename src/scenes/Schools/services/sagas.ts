import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { SchoolActionTypes } from './models'
import { fetchSchoolsSuccess, fetchSchoolsError } from './actions'
import { constructApiRequest } from './api'

function* fetchSchools() {
  try {
    const { data } = yield call(constructApiRequest)
    yield put(fetchSchoolsSuccess(data));
  } catch (e) {
    console.log(e)
    console.log({...e})
    yield put(fetchSchoolsError(e));
  }
}

export default function* allSchoolSagas() {
  yield all([
    yield takeLatest(SchoolActionTypes.FETCH_SCHOOLS, fetchSchools)
  ])
}