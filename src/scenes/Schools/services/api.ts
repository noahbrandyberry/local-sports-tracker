import axios from 'axios';

export const constructApiRequest = () => {
  return axios.get('http://localhost:3000/api/v1/schools.json')
}