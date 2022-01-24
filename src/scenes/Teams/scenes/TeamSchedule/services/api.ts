import axios from 'axios';
import config from 'src/config/config';
import { FetchEventsRequest } from './models';

export const constructApiRequest = ({ schoolId, teamId }: FetchEventsRequest) =>
  axios.get(
    `${config.baseUrl}/schools/${schoolId}/teams/${teamId}/events.json`,
  );
