import moment from 'moment';
import { Event } from 'teams/models';

export const transformEvents = (events: Event[]) => {
  events = events.map((event) => ({
    ...event,
    start: moment(event.start),
  }));
  events.forEach((event) => {
    event.team_results?.sort((a, b) => a.place - b.place);
  });
  events.sort((a, b) => a.start.valueOf() - b.start.valueOf());

  return events;
};
