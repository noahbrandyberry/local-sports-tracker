import { LocationActionTypes } from './models'

export const fetchLocation = (data) => {
  return {
    type: LocationActionTypes.FETCH_LOCATION,
  }
}

export const fetchLocationSuccess = (data) => {
  return {
    type: LocationActionTypes.FETCH_LOCATION_SUCCESS,
    payload: data
  };
}

export const fetchLocationError = (error) => {
  return {
    type: LocationActionTypes.FETCH_LOCATION_ERROR,
    error: error
  }
}
