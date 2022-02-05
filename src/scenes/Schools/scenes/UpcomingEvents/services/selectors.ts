import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectUpcomingEventsData = ({ upcomingEvents }: RootState) =>
  upcomingEvents;

export const selectUpcomingEventsLoading = createSelector(
  selectUpcomingEventsData,
  (upcomingEventsData) => upcomingEventsData.loading,
);

export const selectUpcomingEvents = createSelector(
  selectUpcomingEventsData,
  (upcomingEventsData) => upcomingEventsData.upcomingEvents,
);
