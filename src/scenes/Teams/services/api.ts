import axios from 'axios';
import config from 'src/config/config';
import { FetchTeamsRequest } from './models';

export const constructApiRequest = ({ schoolId }: FetchTeamsRequest) =>
  axios.get(`${config.baseUrl}/schools/${schoolId}/teams.json`);
