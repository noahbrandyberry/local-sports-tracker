import { fork, all } from 'redux-saga/effects';
import schoolsSagas from 'schools/services/sagas';
import teamsSaga from 'teams/services/sagas';
import eventsSaga from 'teams/scenes/TeamSchedule/services/sagas';
import postsSaga from 'teams/scenes/TeamHome/services/sagas';
import deviceTokenSagas from 'services/deviceToken/sagas';
import locationSagas from 'services/location/sagas';

export default function* rootSaga() {
  yield all([
    fork(schoolsSagas),
    fork(teamsSaga),
    fork(eventsSaga),
    fork(postsSaga),
    fork(deviceTokenSagas),
    fork(locationSagas),
  ]);
}
