import axios from 'axios';
import config from 'src/config/config';
import { SaveDeviceTokenRequest } from './models';

export const constructApiRequest = (request: SaveDeviceTokenRequest) =>
  axios.post(`${config.baseUrl}/devices.json`, {
    device: request,
  });
