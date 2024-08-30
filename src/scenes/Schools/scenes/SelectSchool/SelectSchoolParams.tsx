import { School } from 'schools/models';
import { Sport } from 'teams/models';

export type SelectSchoolNavigatorParams = {
  School: { bookmarked: string[] };
  Sport: { school: School };
  Team: { school: School; sport: Sport };
};
