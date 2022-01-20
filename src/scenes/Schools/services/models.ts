import { School } from '@schools/models';

export enum SchoolActionTypes {
  FETCH_SCHOOLS = 'FETCH_SCHOOLS',
  FETCH_SCHOOLS_SUCCESS = 'FETCH_SCHOOLS_SUCCESS',
  FETCH_SCHOOLS_ERROR = 'FETCH_SCHOOLS_ERROR',
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

export type SchoolsAction = GetSchools | GetSchoolsSuccess | GetSchoolsError;
