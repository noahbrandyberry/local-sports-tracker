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

  teams = teams.map((team) => {
    team.season.start = team.season.start
      .clone()
      .set(
        'year',
        team.season.start.month() >= team.year.start.month()
          ? team.year.start.year()
          : team.year.end.year(),
      );

    team.season.end = team.season.end
      .clone()
      .set(
        'year',
        team.season.end.month() >= team.year.start.month()
          ? team.season.start.year()
          : team.year.end.year(),
      );

    return team;
  });

  teams.sort((a, b) => a.name.localeCompare(b.name));

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
