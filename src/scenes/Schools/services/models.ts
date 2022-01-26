import { School } from 'schools/models';

export enum SchoolActionTypes {
  FETCH_SCHOOLS = 'FETCH_SCHOOLS',
  FETCH_SCHOOLS_SUCCESS = 'FETCH_SCHOOLS_SUCCESS',
  FETCH_SCHOOLS_ERROR = 'FETCH_SCHOOLS_ERROR',
  RESET_SCHOOLS = 'RESET_SCHOOLS',
}

export interface GetSchools {
  type: typeof SchoolActionTypes.FETCH_SCHOOLS;
}

export interface GetSchoolsSuccess {
  type: typeof SchoolActionTypes.FETCH_SCHOOLS_SUCCESS;
  payload: School[];
}

export interface GetSchoolsError {
  type: typeof SchoolActionTypes.FETCH_SCHOOLS_ERROR;
  error: Error;
}

export interface ResetSchools {
  type: typeof SchoolActionTypes.RESET_SCHOOLS;
}

export type SchoolsAction =
  | GetSchools
  | GetSchoolsSuccess
  | GetSchoolsError
  | ResetSchools;
