import axios from 'axios';
import { FetchTeamsRequest } from './models';

export const constructApiRequest = ({ schoolId }: FetchTeamsRequest) =>
  axios.get(`http://localhost:3000/api/v1/schools/${schoolId}/teams.json`);
