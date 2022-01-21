import moment from 'moment';
import { createSelector } from 'reselect';
import { RootState } from 'store/model';

export const selectTeamData = ({ teams }: RootState) => teams;

export const selectTeams = createSelector(
  selectTeamData,
  (teamsData) => teamsData.teams,
);

export const selectCurrentTeams = createSelector(selectTeams, (teams) => {
  const now = moment();
  return teams
    .filter((team) => now.isBetween(team.year.start, team.year.end))
    .filter((team) => {
      const seasonStart = team.season.start
        .clone()
        .set(
          'year',
          team.season.start.month() >= team.year.start.month()
            ? team.year.start.year()
            : team.year.end.year(),
        );

      const seasonEnd = team.season.end
        .clone()
        .set(
          'year',
          team.season.end.month() >= team.year.start.month()
            ? team.year.start.year()
            : team.year.end.year(),
        );

      return now.isBetween(seasonStart, seasonEnd);
    });
});
