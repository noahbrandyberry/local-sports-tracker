import { SportNames } from 'src/enums/sportIcons';

export interface Sport {
  id: number;
  name: keyof typeof SportNames;
  created_at: string;
  updated_at: string;
}
