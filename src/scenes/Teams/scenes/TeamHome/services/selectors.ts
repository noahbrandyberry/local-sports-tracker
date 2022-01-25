import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectPostsData = ({ posts }: RootState) => posts;

export const selectPostsLoading = createSelector(
  selectPostsData,
  (postsData) => postsData.loading,
);

export const selectPosts = createSelector(
  selectPostsData,
  (postsData) => postsData.posts,
);

export const selectPostById = (id: string) =>
  createSelector(selectPosts, (posts) => posts.find((post) => post.id === id));
