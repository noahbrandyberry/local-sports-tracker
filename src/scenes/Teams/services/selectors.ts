import moment from 'moment';
import { createSelector } from 'reselect';
import { RootState } from 'store/model';
import uniqBy from 'lodash/uniqBy';

export const selectTeamsData = ({ teams }: RootState) => teams;

export const selectTeamsLoading = createSelector(
  selectTeamsData,
  (teamsData) => teamsData.loading,
);

export const selectTeams = createSelector(
  selectTeamsData,
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

export const selectCurrentSports = createSelector(selectCurrentTeams, (teams) =>
  uniqBy(
    teams.map((team) => team.sport),
    'name',
  ),
);

export const selectCurrentSeason = createSelector(
  selectCurrentTeams,
  (teams) => {
    const seasons = uniqBy(
      teams.map((team) => team.season),
      'name',
    );
    const currentSeason = seasons.find(
      (season) => season.name !== 'Year-round',
    );

    return currentSeason ?? seasons[0];
  },
);

export const selectTeamsBySportId = (sportId: number) =>
  createSelector(selectTeams, (teams) =>
    teams.filter((team) => team.sport.id === sportId),
  );

export const selectTeamById = (id: number) =>
  createSelector(selectTeams, (teams) => teams.find((team) => team.id === id));
