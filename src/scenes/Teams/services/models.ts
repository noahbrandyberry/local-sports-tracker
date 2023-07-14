import { Team } from 'teams/models';

export enum TeamActionTypes {
  FETCH_TEAMS = 'FETCH_TEAMS',
  FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS',
  FETCH_TEAMS_ERROR = 'FETCH_TEAMS_ERROR',
  RESET_TEAMS = 'RESET_TEAMS',
}

export interface FetchTeamsRequest {
  schoolId: number;
}

export interface GetTeams {
  type: typeof TeamActionTypes.FETCH_TEAMS;
  data: FetchTeamsRequest;
}

export interface GetTeamsSuccess {
  type: typeof TeamActionTypes.FETCH_TEAMS_SUCCESS;
  payload: Team[];
}

export interface GetTeamsError {
  type: typeof TeamActionTypes.FETCH_TEAMS_ERROR;
  error: Error;
}

export interface ResetTeams {
  type: typeof TeamActionTypes.RESET_TEAMS;
}

export type TeamsAction =
  | GetTeams
  | GetTeamsSuccess
  | GetTeamsError
  | ResetTeams;

export const SortedGenders = ['Boys', 'Girls', 'Coed'];
export const SortedLevels = [
  'Varsity',
  'Junior Varsity',
  'B Squad',
  'Freshman',
  'Sophomore',
  'Middle School',
  '7th Grade',
  '8th Grade',
  'Youth',
  'Unified',
];
