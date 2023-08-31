import { Event } from 'teams/models';

export enum EventActionTypes {
  FETCH_EVENTS = 'FETCH_EVENTS',
  FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_ERROR = 'FETCH_EVENTS_ERROR',
  RESET_EVENTS = 'RESET_EVENTS',
}

export interface FetchEventsRequest {
  schoolId: string;
  teamId: string;
}

export interface GetEvents {
  type: typeof EventActionTypes.FETCH_EVENTS;
  data: FetchEventsRequest;
}

export interface GetEventsSuccess {
  type: typeof EventActionTypes.FETCH_EVENTS_SUCCESS;
  payload: Event[];
}

export interface GetEventsError {
  type: typeof EventActionTypes.FETCH_EVENTS_ERROR;
  error: Error;
}

export interface ResetEvents {
  type: typeof EventActionTypes.RESET_EVENTS;
}

export type EventsAction =
  | GetEvents
  | GetEventsSuccess
  | GetEventsError
  | ResetEvents;
