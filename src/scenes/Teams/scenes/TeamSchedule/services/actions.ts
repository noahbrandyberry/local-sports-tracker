import { FetchEventsRequest, EventActionTypes } from './models';
import { Event } from 'teams/models';

export const fetchEvents = (data: FetchEventsRequest) => ({
  type: EventActionTypes.FETCH_EVENTS,
  data,
});

export const fetchEventsSuccess = (data: Event[]) => ({
  type: EventActionTypes.FETCH_EVENTS_SUCCESS,
  payload: data,
});

export const fetchEventsError = (error: Error) => ({
  type: EventActionTypes.FETCH_EVENTS_ERROR,
  error: error,
});

export const resetEvents = () => ({
  type: EventActionTypes.RESET_EVENTS,
});
