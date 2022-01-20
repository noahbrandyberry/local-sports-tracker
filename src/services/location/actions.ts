import { LocationActionTypes } from './models';
import { Location } from 'react-native-get-location';

export const fetchLocation = () => ({
  type: LocationActionTypes.FETCH_LOCATION,
});

export const fetchLocationSuccess = (data: Location) => ({
  type: LocationActionTypes.FETCH_LOCATION_SUCCESS,
  payload: data,
});

export const fetchLocationError = (error: Error) => ({
  type: LocationActionTypes.FETCH_LOCATION_ERROR,
  error: error,
});
