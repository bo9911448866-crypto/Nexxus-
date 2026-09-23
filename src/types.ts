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

