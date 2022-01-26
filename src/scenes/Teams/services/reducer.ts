import { Team } from 'teams/models';
import { TeamActionTypes, TeamsAction } from './models';

export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: Error | null;
}

const initialState = {
  teams: [],
  loading: true,
  error: null,
};

export const teamsReducer = (
  state: TeamsState = initialState,
  action: TeamsAction,
): TeamsState => {
  switch (action.type) {
    case TeamActionTypes.FETCH_TEAMS:
      return { ...state, error: null, loading: true };
    case TeamActionTypes.FETCH_TEAMS_SUCCESS:
      return { ...state, teams: action.payload, loading: false };
    case TeamActionTypes.FETCH_TEAMS_ERROR:
      return { ...state, error: action.error, loading: false, teams: [] };
    case TeamActionTypes.RESET_TEAMS:
      return initialState;
    default:
      return state;
  }
};
