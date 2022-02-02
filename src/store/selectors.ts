import { createSelector } from 'reselect';
import { selectSchoolsLoading } from 'schools/services/selectors';
import { selectPostsLoading } from 'teams/scenes/TeamHome/services/selectors';
import { selectEventsLoading } from 'teams/scenes/TeamSchedule/services/selectors';
import { selectTeamsLoading } from 'teams/services/selectors';

export const selectSchoolTeamsLoading = createSelector(
  selectSchoolsLoading,
  selectTeamsLoading,
  (schoolsLoading, teamsLoading) => schoolsLoading || teamsLoading,
);

export const selectDataLoading = createSelector(
  selectSchoolTeamsLoading,
  selectEventsLoading,
  selectPostsLoading,
  (schoolsTeamsLoading, eventsLoading, postsLoading) =>
    schoolsTeamsLoading || eventsLoading || postsLoading,
);
