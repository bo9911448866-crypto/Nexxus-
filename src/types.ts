export type { Game } from './data/games.ts';

export type CategoryFilter =
  | 'all'
  | 'featured'
  | 'favorites'
  | 'recent'
  | 'flash'
  | 'action'
  | 'arcade'
  | 'platformer'
  | 'puzzle'
  | 'driving'
  | 'sports'
  | 'idle';

export type SortOption = 'az' | 'za' | 'popular' | 'recent';

export type ViewMode = 'grid' | 'list';

export interface PlayHistoryItem {
  id: string;
  lastPlayed: number;
  playCount: number;
}

export type NavigationTab = 'games' | 'schedule';

export interface ClassScheduleItem {
  id: string;
  name: string;
  startTime: string; // "HH:MM" in 24-hour format e.g. "08:30"
  endTime: string;   // "HH:MM" in 24-hour format e.g. "09:25"
  teacher?: string;
  room?: string;
  days: number[];    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  color?: string;    // Hex or tailwind color token
  notes?: string;
}

