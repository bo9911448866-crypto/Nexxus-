import React, { useState, useEffect, useMemo } from 'react';
import { GAMES } from './data/games.ts';
import { Game, CategoryFilter, SortOption, ViewMode } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { GameCard } from './components/GameCard.tsx';
import { GameListItem } from './components/GameListItem.tsx';
import { GamePlayer } from './components/GamePlayer.tsx';
import { IntroSequence } from './components/IntroSequence.tsx';
import { Gamepad2, Search, ArrowUp, Star, Sparkles } from 'lucide-react';

export default function App() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Check if user has already experienced intro in this tab session
    try {
      return !sessionStorage.getItem('nexxus_intro_seen');
    } catch {
      return true;
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexxus_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Recently played history: map of gameId -> timestamp
  const [recentHistory, setRecentHistory] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('nexxus_recent_history');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexxus_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  // Save recent history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexxus_recent_history', JSON.stringify(recentHistory));
    } catch (e) {
      console.warn('Could not save recent history', e);
    }
  }, [recentHistory]);

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleSelectGame = (game: Game) => {
    // Record in recent history
    setRecentHistory((prev) => ({
      ...prev,
      [game.id]: Date.now(),
    }));
    setActiveGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomGame = () => {
    const list = filteredAndSortedGames.length > 0 ? filteredAndSortedGames : GAMES;
    const randomIndex = Math.floor(Math.random() * list.length);
    const chosen = list[randomIndex];
    if (chosen) {
      handleSelectGame(chosen);
    }
  };

  const handleCompleteIntro = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('nexxus_intro_seen', 'true');
    } catch {}
  };

  const handlePlayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro) {
        if (e.key === 'Escape') {
          handleCompleteIntro();
        }
        return;
      }
      // Escape returns home from game or clears search
      if (e.key === 'Escape') {
        if (activeGame) {
          setActiveGame(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
      // '/' focuses search bar when not already typing
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        document.getElementById('games-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, searchQuery, showIntro]);

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return GAMES.filter((game) => {
      // 1. Search Query Filter
      if (query) {
        const titleMatch = game.title.toLowerCase().includes(query);
        const aliasMatch = game.aliases.some((a) => a.toLowerCase().includes(query));
        const categoryMatch = game.categories.some((c) => c.toLowerCase().includes(query));
        if (!titleMatch && !aliasMatch && !categoryMatch) return false;
      }

      // 2. Category Filter
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'featured') return !!game.featured;
      if (selectedCategory === 'favorites') return favorites.includes(game.id);
      if (selectedCategory === 'recent') return !!recentHistory[game.id];
      if (selectedCategory === 'flash') return game.type === 'flash';

      if (selectedCategory === 'action') {
        return (
          game.categories.includes('action') ||
          game.categories.includes('battle') ||
          game.categories.includes('war') ||
          game.categories.includes('shooter')
        );
      }
      if (selectedCategory === 'arcade') {
        return game.categories.includes('arcade') || game.categories.includes('runner');
      }
      if (selectedCategory === 'platformer') {
        return game.categories.includes('platformer');
      }
      if (selectedCategory === 'puzzle') {
        return (
          game.categories.includes('puzzle') ||
          game.categories.includes('logic') ||
          game.categories.includes('physics')
        );
      }
      if (selectedCategory === 'driving') {
        return (
          game.categories.includes('driving') ||
          game.categories.includes('drift') ||
          game.categories.includes('racing')
        );
      }
      if (selectedCategory === 'sports') {
        return (
          game.categories.includes('sports') ||
          game.categories.includes('basket') ||
          game.categories.includes('boxing')
        );
      }
      if (selectedCategory === 'idle') {
        return game.categories.includes('idle') || game.categories.includes('clicker');
      }

      return game.categories.includes(selectedCategory);
    }).sort((a, b) => {
      // Sort logic
      if (selectedSort === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (selectedSort === 'za') {
        return b.title.localeCompare(a.title);
      }
      if (selectedSort === 'recent') {
        const timeA = recentHistory[a.id] || 0;
        const timeB = recentHistory[b.id] || 0;
        return timeB - timeA;
      }
      // 'popular' default: featured first, then favorite first, then alphabetical
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [searchQuery, selectedCategory, selectedSort, favorites, recentHistory]);

  const featuredList = useMemo(() => GAMES.filter((g) => g.featured), []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Fullscreen Cinematic Intro Overlay */}
      {showIntro && <IntroSequence onComplete={handleCompleteIntro} />}

      {/* Top Sticky Header */}
      <Navbar
        totalGames={GAMES.length}
        favoritesCount={favorites.length}
        onRandomGame={handleRandomGame}
        onToggleFavoritesOnly={() =>
          setSelectedCategory((prev) => (prev === 'favorites' ? 'all' : 'favorites'))
        }
        showingFavoritesOnly={selectedCategory === 'favorites'}
        onPlayIntro={handlePlayIntro}
        onHomeClick={() => {
          setActiveGame(null);
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      {activeGame ? (
        <GamePlayer
          game={activeGame}
          onBack={() => setActiveGame(null)}
          onSelectGame={handleSelectGame}
          onRandomGame={handleRandomGame}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={toggleFavorite}
          allGames={GAMES}
        />
      ) : (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          {/* Hero Spotlight (shown when not actively searching) */}
          {!searchQuery && selectedCategory === 'all' && (
            <HeroBanner
              onQuickPlay={handleRandomGame}
              onExplore={() => {
                const el = document.getElementById('archive-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              featuredGames={featuredList}
              onSelectGame={handleSelectGame}
              onPlayIntro={handlePlayIntro}
            />
          )}

          {/* Archive / Games Section */}
          <div id="archive-section" className="pt-6">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalFiltered={filteredAndSortedGames.length}
              totalAll={GAMES.length}
            />

            {/* Empty State */}
            {filteredAndSortedGames.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950 text-zinc-500">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-['Syne',sans-serif] text-base font-bold text-white uppercase tracking-wider">
                  No Titles Found
                </h3>
                <p className="mt-1 font-mono text-xs text-zinc-500 max-w-sm">
                  No games matched "{searchQuery}". Try a different keyword or reset filters.
                </p>
                <button
                  id="reset-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-white hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            )}

            {/* Games Listing */}
            {filteredAndSortedGames.length > 0 && (
              <div className="mt-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredAndSortedGames.map((game, index) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        index={index}
                        isFavorite={favorites.includes(game.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelectGame={handleSelectGame}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-sm border border-zinc-850 bg-black">
                    {filteredAndSortedGames.map((game, index) => (
                      <GameListItem
                        key={game.id}
                        game={game}
                        index={index}
                        isFavorite={favorites.includes(game.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelectGame={handleSelectGame}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      {!activeGame && (
        <footer className="border-t border-zinc-900 bg-black py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950 font-mono text-xs font-bold text-white">
                NX
              </span>
              <span className="font-['Syne',sans-serif] text-sm font-bold tracking-widest text-white uppercase">
                NEXXUS
              </span>
              <span className="font-mono text-xs text-zinc-600">
                // MONKEYGG2 PRESERVATION ARCHIVE
              </span>
            </div>

            <div className="font-mono text-[11px] text-zinc-500">
              <span>{GAMES.length} TITLES ACCESSIBLE</span> &bull; <span>BLACK & WHITE EDITION</span>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              BACK TO TOP
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
