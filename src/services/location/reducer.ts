import { LocationActionTypes } from './models'

const initialState = {
  currentLocation: null,
  loading: true,
  error: null
}

export const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LocationActionTypes.FETCH_LOCATION:
      return { ...state, error: null, loading: true }
    case LocationActionTypes.FETCH_LOCATION_SUCCESS:
      return { ...state, currentLocation: action.payload, loading: false }
    case LocationActionTypes.FETCH_LOCATION_ERROR:
      return { ...state, error: action.error, loading: false }
    default:
      return state
  }
}