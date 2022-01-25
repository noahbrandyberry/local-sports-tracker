import { Post } from 'teams/models';

export enum PostActionTypes {
  FETCH_POSTS = 'FETCH_POSTS',
  FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS',
  FETCH_POSTS_ERROR = 'FETCH_POSTS_ERROR',
}

export interface FetchPostsRequest {
  schoolId: number;
  teamId: number;
}

export interface GetPosts {
  type: typeof PostActionTypes.FETCH_POSTS;
  data: FetchPostsRequest;
}

export interface GetPostsSuccess {
  type: typeof PostActionTypes.FETCH_POSTS_SUCCESS;
  payload: Post[];
}

export interface GetPostsError {
  type: typeof PostActionTypes.FETCH_POSTS_ERROR;
  error: Error;
}

export type PostsAction = GetPosts | GetPostsSuccess | GetPostsError;
