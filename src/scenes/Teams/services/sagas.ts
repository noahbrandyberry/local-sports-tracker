import { call, put, takeLatest } from 'redux-saga/effects';
import { GetTeams, TeamActionTypes } from './models';
import { fetchTeamsSuccess, fetchTeamsError } from './actions';
import { constructApiRequest } from './api';
import { transformTeams } from './transform';

function* fetchTeams(action: GetTeams) {
  try {
    const { data } = yield call(constructApiRequest, action.data);
    yield put(fetchTeamsSuccess(transformTeams(data)));
  } catch (e) {
    yield put(fetchTeamsError(e));
  }
}

export default function* allTeamSagas() {
  yield takeLatest(TeamActionTypes.FETCH_TEAMS, fetchTeams);
}
