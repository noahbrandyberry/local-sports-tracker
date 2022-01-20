import { School } from 'schools/models';
import { SchoolActionTypes, SchoolsAction } from './models';

export interface SchoolsState {
  schools: School[];
  loading: boolean;
  error: Error | null;
}

const initialState = {
  schools: [],
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
      return { ...state, schools: action.payload, loading: false };
    case SchoolActionTypes.FETCH_SCHOOLS_ERROR:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};
