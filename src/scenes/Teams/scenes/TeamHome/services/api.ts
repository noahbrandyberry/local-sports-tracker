import axios from 'axios';
import config from 'src/config/config';
import { FetchPostsRequest } from './models';

export const constructApiRequest = ({ schoolId, teamId }: FetchPostsRequest) =>
  axios.get(
    `${config.baseUrl}/schools/${schoolId}/teams/${teamId}/pressbox_posts.json`,
  );
