import { Event } from 'teams/models';
import { EventActionTypes, EventsAction } from './models';

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: Error | null;
}

const initialState = {
  events: [],
  loading: true,
  error: null,
};

export const eventsReducer = (
  state: EventsState = initialState,
  action: EventsAction,
): EventsState => {
  switch (action.type) {
    case EventActionTypes.FETCH_EVENTS:
      return { ...state, error: null, loading: true };
    case EventActionTypes.FETCH_EVENTS_SUCCESS:
      return { ...state, events: action.payload, loading: false };
    case EventActionTypes.FETCH_EVENTS_ERROR:
      return { ...state, error: action.error, loading: false };
    case EventActionTypes.RESET_EVENTS:
      return initialState;
    default:
      return state;
  }
};
