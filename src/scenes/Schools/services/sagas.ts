import { call, put, takeLatest } from 'redux-saga/effects';
import { SchoolActionTypes } from './models';
import { fetchSchoolsSuccess, fetchSchoolsError } from './actions';
import { constructApiRequest } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* fetchSchools() {
  try {
    const { data } = yield call(constructApiRequest);
    const schoolId: string = yield call(AsyncStorage.getItem, '@defaultSchool');

    yield put(fetchSchoolsSuccess(data, schoolId ? Number(schoolId) : null));
  } catch (e) {
    yield put(fetchSchoolsError(e));
  }
}

export default function* allSchoolSagas() {
  yield takeLatest(SchoolActionTypes.FETCH_SCHOOLS, fetchSchools);
}
