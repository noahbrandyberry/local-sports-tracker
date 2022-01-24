import { call, put, takeLatest } from 'redux-saga/effects';
import { GetEvents, EventActionTypes } from './models';
import { fetchEventsSuccess, fetchEventsError } from './actions';
import { constructApiRequest } from './api';
import { transformEvents } from './transform';

function* fetchEvents(action: GetEvents) {
  try {
    const { data } = yield call(constructApiRequest, action.data);
    yield put(fetchEventsSuccess(transformEvents(data)));
  } catch (e) {
    yield put(fetchEventsError(e));
  }
}

export default function* allEventSagas() {
  yield takeLatest(EventActionTypes.FETCH_EVENTS, fetchEvents);
}
