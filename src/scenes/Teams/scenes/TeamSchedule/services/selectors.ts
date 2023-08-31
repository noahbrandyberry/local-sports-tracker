import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectEventsData = ({ events }: RootState) => events;

export const selectEventsLoading = createSelector(
  selectEventsData,
  (eventsData) => eventsData.loading,
);

export const selectEvents = createSelector(selectEventsData, (eventsData) =>
  eventsData.events.filter((event) => !event.canceled),
);

export const selectEventById = (id: string) =>
  createSelector(selectEvents, (events) =>
    events.find((event) => event.id === id),
  );
