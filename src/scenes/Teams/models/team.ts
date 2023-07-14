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
  record?: Record;
  images?: Image[];
}

interface Image {
  id: string;
  url: string;
  description: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export interface Record {
  tie: number;
  win: number;
  loss: number;
}
