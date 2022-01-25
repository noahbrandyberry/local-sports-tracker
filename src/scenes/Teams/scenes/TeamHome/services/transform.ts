import moment from 'moment';
import { Post } from 'teams/models';

export const transformPosts = (posts: Post[]) => {
  posts = posts.map((post) => ({
    ...post,
    created: moment(post.created),
    modified: moment(post.modified),
    submitted: moment(post.submitted),
    boxscore: JSON.parse(post.boxscore as string),
    recap: JSON.parse(post.recap as string),
  }));

  posts.sort((a, b) => a.submitted.valueOf() - b.submitted.valueOf()).reverse();
  return posts;
};
