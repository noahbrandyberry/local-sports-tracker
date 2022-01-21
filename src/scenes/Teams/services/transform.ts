import moment from 'moment';
import { Team } from 'teams/models';

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
  return teams;
};
