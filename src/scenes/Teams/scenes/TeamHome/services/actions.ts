import { FetchPostsRequest, PostActionTypes } from './models';
import { Post } from 'teams/models';

export const fetchPosts = (data: FetchPostsRequest) => ({
  type: PostActionTypes.FETCH_POSTS,
  data,
});

export const fetchPostsSuccess = (data: Post[]) => ({
  type: PostActionTypes.FETCH_POSTS_SUCCESS,
  payload: data,
});

export const fetchPostsError = (error: Error) => ({
  type: PostActionTypes.FETCH_POSTS_ERROR,
  error: error,
});
