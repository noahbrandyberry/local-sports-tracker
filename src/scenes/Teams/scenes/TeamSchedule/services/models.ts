import { Event } from 'teams/models';

export enum EventActionTypes {
  FETCH_EVENTS = 'FETCH_EVENTS',
  FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_ERROR = 'FETCH_EVENTS_ERROR',
}

export interface FetchEventsRequest {
  schoolId: number;
  teamId: number;
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

export type EventsAction = GetEvents | GetEventsSuccess | GetEventsError;
