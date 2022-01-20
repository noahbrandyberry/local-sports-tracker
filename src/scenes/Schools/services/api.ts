import axios from 'axios';

export const constructApiRequest = () =>
  axios.get('http://localhost:3000/api/v1/schools.json');
