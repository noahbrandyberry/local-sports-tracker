import moment from 'moment';
import { Event } from 'teams/models';

export const transformEvents = (events: Event[]) => {
  events = events.map((event) => ({
    ...event,
    start: moment(event.start),
  }));
  return events;
};
