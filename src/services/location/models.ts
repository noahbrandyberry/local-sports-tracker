import { Location } from 'react-native-get-location';

export enum LocationActionTypes {
  FETCH_LOCATION = 'FETCH_LOCATION',
  FETCH_LOCATION_SUCCESS = 'FETCH_LOCATION_SUCCESS',
  FETCH_LOCATION_ERROR = 'FETCH_LOCATION_ERROR',
}

export interface GetLocation {
  type: typeof LocationActionTypes.FETCH_LOCATION;
}

export interface GetLocationSuccess {
  type: typeof LocationActionTypes.FETCH_LOCATION_SUCCESS;
  payload: Location;
}

export interface GetLocationError {
  type: typeof LocationActionTypes.FETCH_LOCATION_ERROR;
  error: Error;
}

export type LocationAction =
  | GetLocation
  | GetLocationSuccess
  | GetLocationError;
