import { FetchUpcomingEventsRequest, UpcomingEventActionTypes } from './models';
import { Event } from 'teams/models';

export const fetchUpcomingEvents = (data: FetchUpcomingEventsRequest) => ({
  type: UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS,
  data,
});

export const fetchUpcomingEventsSuccess = (data: Event[]) => ({
  type: UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_SUCCESS,
  payload: data,
});

export const fetchUpcomingEventsError = (error: Error) => ({
  type: UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_ERROR,
  error: error,
});

export const resetUpcomingEvents = () => ({
  type: UpcomingEventActionTypes.RESET_UPCOMING_EVENTS,
});
