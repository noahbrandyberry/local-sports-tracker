import { Event } from 'teams/models';
import { UpcomingEventActionTypes, UpcomingEventsAction } from './models';

export interface UpcomingEventsState {
  upcomingEvents: Event[];
  loading: boolean;
  error: Error | null;
}

const initialState = {
  upcomingEvents: [],
  loading: true,
  error: null,
};

export const upcomingEventsReducer = (
  state: UpcomingEventsState = initialState,
  action: UpcomingEventsAction,
): UpcomingEventsState => {
  switch (action.type) {
    case UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS:
      return { ...state, error: null, loading: true };
    case UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_SUCCESS:
      return { ...state, upcomingEvents: action.payload, loading: false };
    case UpcomingEventActionTypes.FETCH_UPCOMING_EVENTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        upcomingEvents: [],
      };
    case UpcomingEventActionTypes.RESET_UPCOMING_EVENTS:
      return initialState;
    default:
      return state;
  }
};
