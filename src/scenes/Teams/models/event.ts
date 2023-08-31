import { Moment } from 'moment';
import { Location } from 'schools/models';
import { Team } from '.';

export interface Event {
  id: string;
  name: string;
  event_type: string;
  start: Moment;
  tba: boolean;
  result_type: string;
  conference: boolean;
  scrimmage: boolean;
  location_verified: boolean;
  home: boolean;
  canceled: boolean;
  postponed: boolean;
  location_name?: string;
  location: Location;
  opponents: Team[];
  created_at: string;
  updated_at: string;
  team_results: TeamResult[];
  result?: Result;
  result_status?: ResultStatus;
  opponent_name: string;
  selected_team_id: string;
}

export interface Result {
  home: number;
  away: number;
}

export interface TeamResult {
  id: number;
  team_id: string;
  name: string;
  place: number;
  points: number;
  event_id: string;
  school_id: string;
}

export enum ResultStatus {
  WIN = 'win',
  LOSS = 'loss',
  TIE = 'tie',
}
