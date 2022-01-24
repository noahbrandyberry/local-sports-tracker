import axios from 'axios';
import config from 'src/config/config';

export const constructApiRequest = () =>
  axios.get(`${config.baseUrl}/schools.json`);
