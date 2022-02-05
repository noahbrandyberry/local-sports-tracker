import { call, put, takeLatest } from 'redux-saga/effects';
import { GetUpcomingEvents, UpcomingEventActionTypes } from './models';
import {
  fetchUpcomingEventsSuccess,
  fetchUpcomingEventsError,
} from './actions';
import { constructApiRequest } from './api';
import { transformEvents } from 'teams/scenes/TeamSchedule/services/transform';

function* fetchUpcomingEvents(action: GetUpcomingEvents) {
  try {
    const { data } = yield call(constructApiRequest, action.data);
    yield put(fetchUpcomingEventsSuccess(transformEvents(data)));
  } catch (e) {
    console.log(e);
    yield put(fetchUpcomingEventsError(e));
  }
}

export default function* allUpcomingEventSagas() {
  yield takeLatest(
    UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS,
    fetchUpcomingEvents,
  );
}
