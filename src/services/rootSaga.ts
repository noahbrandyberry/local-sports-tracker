import { fork, all } from 'redux-saga/effects'
import schoolsSagas from '../scenes/Schools/services/sagas';
import locationSagas from './location/sagas';

export default function* rootSaga() {
  yield all([
    fork(schoolsSagas),
    fork(locationSagas),
  ]);
}