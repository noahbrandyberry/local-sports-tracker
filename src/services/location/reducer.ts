import { Location } from 'react-native-get-location';
import { LocationAction, LocationActionTypes } from './models';

export interface LocationState {
  currentLocation: Location | null;
  loading: boolean;
  error: Error | null;
}

const initialState = {
  currentLocation: null,
  loading: true,
  error: null,
};

export const locationReducer = (
  state: LocationState = initialState,
  action: LocationAction,
) => {
  switch (action.type) {
    case LocationActionTypes.FETCH_LOCATION: {
      return { ...state, error: null, loading: true };
    }
    case LocationActionTypes.FETCH_LOCATION_SUCCESS: {
      return { ...state, currentLocation: action.payload, loading: false };
    }
    case LocationActionTypes.FETCH_LOCATION_ERROR: {
      return { ...state, error: action.error, loading: false };
    }
    default:
      return state;
  }
};
