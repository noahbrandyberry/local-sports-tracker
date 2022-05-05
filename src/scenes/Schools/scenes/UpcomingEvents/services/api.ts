import axios from 'axios';
import config from 'src/config/config';
import { FetchUpcomingEventsRequest } from './models';

export const constructApiRequest = ({
  schoolId,
  ...params
}: FetchUpcomingEventsRequest) =>
  axios.get(`${config.baseUrl}/schools/${schoolId}/upcoming_events.json`, {
    params,
  });
