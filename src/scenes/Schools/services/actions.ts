import { SchoolActionTypes } from './models'

export const fetchSchools = (data) => {
  return {
    type: SchoolActionTypes.FETCH_SCHOOLS,
  }
}

export const fetchSchoolsSuccess = (data) => {
  return {
    type: SchoolActionTypes.FETCH_SCHOOLS_SUCCESS,
    payload: data
  };
}

export const fetchSchoolsError = (error) => {
  return {
    type: SchoolActionTypes.FETCH_SCHOOLS_ERROR,
    error: error
  }
}
