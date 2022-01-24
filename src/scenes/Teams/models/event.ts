import { Moment } from 'moment';
import { Location } from 'schools/models';

export interface Event {
  id: number;
  name: string;
  event_type: string;
  start: Moment;
  tba: boolean;
  result_type: string;
  conference: boolean;
  scrimmage: boolean;
  location_verified: boolean;
  private_notes: string;
  public_notes: string;
  bus_dismissal_datetime_local: string;
  bus_departure_datetime_local: string;
  bus_return_datetime_local: string;
  home: boolean;
  canceled: boolean;
  postponed: boolean;
  location: Location;
  host_team_id: number;
  created_at: string;
  updated_at: string;
}
