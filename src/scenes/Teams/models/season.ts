import { Moment } from 'moment';

export interface Season {
  id: number;
  name: string;
  start: Moment;
  end: Moment;
  created_at: string;
  updated_at: string;
}
