import axios from 'axios';
import config from 'src/config/config';
import { SaveDeviceTokenRequest } from './models';

export const constructApiRequest = ({ deviceToken }: SaveDeviceTokenRequest) =>
  axios.post(`${config.baseUrl}/devices.json`, {
    device: { device_token: deviceToken },
  });
