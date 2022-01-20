import { SchoolActionTypes } from './models'

const initialState = {
  schools: [],
  loading: true,
  error: null
}

export const schoolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SchoolActionTypes.FETCH_SCHOOLS:
      return { ...state, error: null, loading: true }
    case SchoolActionTypes.FETCH_SCHOOLS_SUCCESS:
      return { ...state, schools: action.payload, loading: false }
    case SchoolActionTypes.FETCH_SCHOOLS_ERROR:
      return { ...state, error: action.error, loading: false }
    default:
      return state
  }
}