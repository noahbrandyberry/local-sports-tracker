import { Post } from 'teams/models';
import { PostActionTypes, PostsAction } from './models';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: Error | null;
}

const initialState = {
  posts: [],
  loading: true,
  error: null,
};

export const postsReducer = (
  state: PostsState = initialState,
  action: PostsAction,
): PostsState => {
  switch (action.type) {
    case PostActionTypes.FETCH_POSTS:
      return { ...state, error: null, loading: true, posts: [] };
    case PostActionTypes.FETCH_POSTS_SUCCESS:
      return { ...state, posts: action.payload, loading: false };
    case PostActionTypes.FETCH_POSTS_ERROR:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};
