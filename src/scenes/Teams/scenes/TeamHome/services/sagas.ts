import { call, put, takeLatest } from 'redux-saga/effects';
import { GetPosts, PostActionTypes } from './models';
import { fetchPostsSuccess, fetchPostsError } from './actions';
import { constructApiRequest } from './api';
import { transformPosts } from './transform';

function* fetchPosts(action: GetPosts) {
  try {
    const { data } = yield call(constructApiRequest, action.data);
    yield put(fetchPostsSuccess(transformPosts(data)));
  } catch (e) {
    yield put(fetchPostsError(e));
  }
}

export default function* allPostSagas() {
  yield takeLatest(PostActionTypes.FETCH_POSTS, fetchPosts);
}
