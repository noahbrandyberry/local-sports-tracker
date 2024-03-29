import { School } from 'schools/models';
import { SchoolActionTypes, SchoolsAction } from './models';

export interface SchoolsState {
  schools: School[];
  defaultSchool: string | null;
  loading: boolean;
  error: Error | null;
}

const initialState = {
  schools: [],
  defaultSchool: null,
  loading: true,
  error: null,
};

export const schoolsReducer = (
  state: SchoolsState = initialState,
  action: SchoolsAction,
): SchoolsState => {
  switch (action.type) {
    case SchoolActionTypes.FETCH_SCHOOLS:
      return { ...state, error: null, loading: true };
    case SchoolActionTypes.FETCH_SCHOOLS_SUCCESS:
      return {
        ...state,
        schools: action.payload,
        loading: false,
        defaultSchool: action.defaultSchool,
      };
    case SchoolActionTypes.FETCH_SCHOOLS_ERROR:
      return { ...state, error: action.error, loading: false };
    case SchoolActionTypes.RESET_SCHOOLS:
      return initialState;
    default:
      return state;
  }
};
