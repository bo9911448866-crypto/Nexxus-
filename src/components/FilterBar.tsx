import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal, Flame, Sparkles, Gamepad2 } from 'lucide-react';
import { CategoryFilter, SortOption, ViewMode } from '../types.ts';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAll: number;
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'flash', label: 'Flash Classics' },
  { id: 'action', label: 'Action & War' },
  { id: 'arcade', label: 'Arcade & Runner' },
  { id: 'platformer', label: 'Platformer' },
  { id: 'puzzle', label: 'Puzzle & Logic' },
  { id: 'driving', label: 'Driving & Drift' },
  { id: 'sports', label: 'Sports' },
  { id: 'idle', label: 'Idle & Clicker' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalAll,
}) => {
  return (
    <div className="w-full space-y-4 border-b border-zinc-800/80 bg-zinc-950/60 pb-5 pt-3">
      {/* Search & Sort Controls Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            id="games-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or alias (e.g., retro bowl, 2048, run 3, slope)..."
            className="w-full rounded-sm border border-zinc-800 bg-black py-2 pl-9 pr-9 font-mono text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
            <select
              id="games-sort-select"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="cursor-pointer appearance-none rounded-sm border border-zinc-800 bg-black py-2 pl-8 pr-8 font-mono text-xs text-zinc-200 transition-colors hover:border-zinc-700 focus:border-white focus:outline-none uppercase"
            >
              <option value="popular">Popular / Featured</option>
              <option value="az">Alphabetical (A - Z)</option>
              <option value="za">Reverse (Z - A)</option>
              <option value="recent">Recently Played</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-sm border border-zinc-800 bg-black p-0.5">
            <button
              id="view-grid-btn"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-sm p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => onViewModeChange('list')}
              className={`rounded-sm p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Compact List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onCategoryChange(cat.id)}
                className={`whitespace-nowrap rounded-sm border px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? 'border-white bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                    : 'border-zinc-800/90 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Counter Tag */}
        <div className="hidden shrink-0 font-mono text-xs tracking-wider text-zinc-500 md:block">
          <span className="text-white font-semibold">{totalFiltered}</span> / {totalAll} TITLES
        </div>
      </div>
    </div>
  );
};
