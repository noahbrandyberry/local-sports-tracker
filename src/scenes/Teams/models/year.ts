import { Moment } from 'moment';

export interface Year {
  id: number;
  name: string;
  start: Moment;
  end: Moment;
  created_at: string;
  updated_at: string;
}
