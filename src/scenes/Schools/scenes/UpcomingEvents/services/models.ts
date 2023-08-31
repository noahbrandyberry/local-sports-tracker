import { Event } from 'teams/models';

export enum UpcomingEventActionTypes {
  FETCH_UPCOMING_EVENTS = 'FETCH_UPCOMING_EVENTS',
  FETCH_UPCOMING_EVENTS_SUCCESS = 'FETCH_UPCOMING_EVENTS_SUCCESS',
  FETCH_UPCOMING_EVENTS_ERROR = 'FETCH_UPCOMING_EVENTS_ERROR',
  RESET_UPCOMING_EVENTS = 'RESET_UPCOMING_EVENTS',
}

export interface FetchUpcomingEventsRequest {
  schoolId: string;
  level_id?: number[];
  gender_id?: number[];
  sport_id?: number[];
  team_id?: string[];
}

export interface GetUpcomingEvents {
  type: typeof UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS;
  data: FetchUpcomingEventsRequest;
}

export interface GetUpcomingEventsSuccess {
  type: typeof UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_SUCCESS;
  payload: Event[];
}

export interface GetUpcomingEventsError {
  type: typeof UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_ERROR;
  error: Error;
}

export interface ResetUpcomingEvents {
  type: typeof UpcomingEventActionTypes.RESET_UPCOMING_EVENTS;
}

export type UpcomingEventsAction =
  | GetUpcomingEvents
  | GetUpcomingEventsSuccess
  | GetUpcomingEventsError
  | ResetUpcomingEvents;
