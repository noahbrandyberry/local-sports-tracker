import moment from 'moment';
import { Post } from 'teams/models';

export const transformPosts = (posts: Post[]) => {
  posts = posts.map((post) => ({
    ...post,
    created: moment(post.created),
    modified: moment(post.modified),
    submitted: post.submitted ? moment(post.submitted) : post.submitted,
    boxscore: JSON.parse(post.boxscore as string),
    recap: JSON.parse(post.recap as string),
  }));

  posts
    .sort(
      (a, b) =>
        (a.submitted ? a.submitted.valueOf() : a.created.valueOf()) -
        (b.submitted ? b.submitted.valueOf() : b.created.valueOf()),
    )
    .reverse();

  posts = posts.filter((post) => post.title);

  return posts;
};
