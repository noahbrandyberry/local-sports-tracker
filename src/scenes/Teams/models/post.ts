import { Moment } from 'moment';

export interface Post {
  id: string;
  is_visible: boolean;
  created: Moment;
  modified: Moment;
  submitted: Moment;
  created_by: string;
  modified_by: string;
  submitted_by: string;
  title: string;
  recap: Recap | string;
  boxscore: BoxScore | string;
  website_only: boolean;
  featured_image: string;
  event_id: number;
  team_id: number;
}

export interface BoxScore {
  headers: number[];
  results: Score[];
}

export interface Score {
  team_name: string;
  team_id: number;
  scores: number[];
}

export interface Recap {
  Summary: string;
}
