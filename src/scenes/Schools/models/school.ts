import { Location } from 'schools/models';

export interface School {
  id: number;
  name: string;
  mascot: string;
  is_vnn: boolean;
  url: string;
  logo_url: string;
  anti_discrimination_disclaimer: string;
  registration_text: string;
  registration_url: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  enrollment: number;
  athletic_director: string;
  phone: string;
  email: string;
  blog: number;
  sportshub_version: number;
  version: number;
  instagram: string;
  onboarding: string;
  distance?: number;
  location?: Location;
  created_at: string;
  updated_at: string;
  visible: boolean;
}
