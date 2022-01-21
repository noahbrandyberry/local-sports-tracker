import { FetchTeamsRequest, TeamActionTypes } from 'teams/services/models';
import { Team } from 'teams/models';

export const fetchTeams = (data: FetchTeamsRequest) => ({
  type: TeamActionTypes.FETCH_TEAMS,
  data,
});

export const fetchTeamsSuccess = (data: Team[]) => ({
  type: TeamActionTypes.FETCH_TEAMS_SUCCESS,
  payload: data,
});

export const fetchTeamsError = (error: Error) => ({
  type: TeamActionTypes.FETCH_TEAMS_ERROR,
  error: error,
});
