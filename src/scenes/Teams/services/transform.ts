import moment from 'moment';
import { Team } from 'teams/models';
import { SortedGenders, SortedLevels } from './models';

export const transformTeams = (teams: Team[]) => {
  teams = teams.map((team) => ({
    ...team,
    year: {
      ...team.year,
      start: moment(team.year.start),
      end: moment(team.year.end),
    },
    season: {
      ...team.season,
      start: moment(team.season.start),
      end: moment(team.season.end),
    },
  }));

  teams.sort(
    (a, b) =>
      SortedLevels.indexOf(a.level?.name ?? '') -
      SortedLevels.indexOf(b.level?.name ?? ''),
  );

  teams.sort(
    (a, b) =>
      SortedGenders.indexOf(a.gender.name) -
      SortedGenders.indexOf(b.gender.name),
  );
  return teams;
};
