import { SchoolActionTypes } from 'schools/services/models';
import { School } from 'schools/models';

export const fetchSchools = () => ({
  type: SchoolActionTypes.FETCH_SCHOOLS,
});

export const fetchSchoolsSuccess = (
  data: School[],
  defaultSchool: number | null,
) => ({
  type: SchoolActionTypes.FETCH_SCHOOLS_SUCCESS,
  payload: data,
  defaultSchool,
});

export const fetchSchoolsError = (error: Error) => ({
  type: SchoolActionTypes.FETCH_SCHOOLS_ERROR,
  error: error,
});

export const resetSchools = () => ({
  type: SchoolActionTypes.RESET_SCHOOLS,
});
