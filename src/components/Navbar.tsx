import React from 'react';
import { Sparkles, Dices, Star, Maximize2, Minimize2, Terminal } from 'lucide-react';

interface NavbarProps {
  totalGames: number;
  favoritesCount: number;
  onRandomGame: () => void;
  onToggleFavoritesOnly: () => void;
  showingFavoritesOnly: boolean;
  onHomeClick: () => void;
  onPlayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalGames,
  favoritesCount,
  onRandomGame,
  onToggleFavoritesOnly,
  showingFavoritesOnly,
  onHomeClick,
  onPlayIntro,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={onHomeClick}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
            title="Return to Nexxus Library"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-950 font-mono text-base font-black tracking-tighter text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black">
              NX
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white ring-2 ring-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Syne',sans-serif] text-xl font-extrabold tracking-widest text-white uppercase">
                  NEXXUS
                </span>
                <span className="hidden sm:inline-flex items-center rounded border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-zinc-400">
                  v2.4
                </span>
              </div>
              <p className="hidden md:block font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                ARCHIVE // {totalGames} UNBLOCKED TITLES
              </p>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites filter toggle */}
          <button
            id="nav-favorites-btn"
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
              showingFavoritesOnly
                ? 'border-white bg-white text-black font-semibold'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white'
            }`}
            title="Show Starred Games"
          >
            <Star
              className={`h-3.5 w-3.5 ${
                showingFavoritesOnly ? 'fill-black text-black' : 'text-zinc-400'
              }`}
            />
            <span className="hidden sm:inline">Favorites</span>
            <span
              className={`rounded px-1 text-[10px] ${
                showingFavoritesOnly ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {favoritesCount}
            </span>
          </button>

          {/* Replay Intro Button */}
          {onPlayIntro && (
            <button
              id="nav-intro-btn"
              onClick={onPlayIntro}
              className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
              title="Watch Cinematic Intro"
            >
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Intro</span>
            </button>
          )}

          {/* Random Game */}
          <button
            id="nav-random-game-btn"
            onClick={onRandomGame}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-200 transition-all hover:border-white hover:bg-zinc-900 hover:text-white active:scale-95"
            title="Play a Random Game"
          >
            <Dices className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white" />
            <span className="hidden sm:inline">Random</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="nav-fullscreen-btn"
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
