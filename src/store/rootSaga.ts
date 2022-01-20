import { fork, all } from 'redux-saga/effects';
import schoolsSagas from '@schools/services/sagas';
import locationSagas from '@services/location/sagas';

export default function* rootSaga() {
  yield all([fork(schoolsSagas), fork(locationSagas)]);
}
