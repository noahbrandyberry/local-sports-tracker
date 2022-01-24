import { Year, Level, Season, Program, Gender, Sport } from '.';

export interface Team {
  id: number;
  name: string;
  label: string;
  photo_url: string;
  home_description: string;
  hide_gender: boolean;
  created_at: string;
  updated_at: string;
  url: string;
  school_id: number;
  level?: Level;
  season: Season;
  year: Year;
  program?: Program;
  gender: Gender;
  sport: Sport;
}
