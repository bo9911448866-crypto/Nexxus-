import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Star,
  Dices,
  Info,
  Layers,
  Gamepad2
} from 'lucide-react';
import { Game } from '../types.ts';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  onSelectGame: (game: Game) => void;
  onRandomGame: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  allGames: Game[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  onSelectGame,
  onRandomGame,
  isFavorite,
  onToggleFavorite,
  allGames,
}) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const gameUrl = game.type === 'flash'
    ? `/games/${game.path}`
    : `/games/${game.path}/`;

  // Reset loading state when game changes
  useEffect(() => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  }, [game.id]);

  // Handle Fullscreen toggle on game container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    window.open(gameUrl, '_blank', 'noopener,noreferrer');
  };

  // Find related games
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && g.categories.some((c) => game.categories.includes(c)))
    .slice(0, 4);

  return (
    <div
      ref={containerRef}
      id="game-theater-container"
      className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-black text-white"
    >
      {/* Top Bar for Game Player */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2.5 sm:px-6">
        {/* Left: Back Button & Game Title */}
        <div className="flex items-center gap-3">
          <button
            id="player-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-white hover:bg-white hover:text-black"
            title="Return to Nexxus Archive"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Archive</span>
          </button>

          <div className="h-4 w-px bg-zinc-800" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Syne',sans-serif] text-base font-bold text-white tracking-wide">
                {game.title}
              </h2>
              <span className="rounded-sm border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                {game.type}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-500">
                {game.categories.map((c) => `#${c}`).join(' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Favorite toggle */}
          <button
            id="player-star-btn"
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-sm border transition-colors ${
              isFavorite
                ? 'border-white bg-white text-black'
                : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-600 hover:text-white'
            }`}
            title={isFavorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-black' : ''}`} />
          </button>

          {/* Reload iframe */}
          <button
            id="player-reload-btn"
            onClick={handleReload}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-black text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
            title="Reload Game"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          {/* Random Next */}
          <button
            id="player-random-btn"
            onClick={onRandomGame}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            title="Next Random Game"
          >
            <Dices className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Next</span>
          </button>

          {/* Fullscreen */}
          <button
            id="player-fullscreen-btn"
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-black text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Open New Tab */}
          <button
            id="player-new-tab-btn"
            onClick={handleOpenNewTab}
            className="flex items-center gap-1.5 rounded-sm border border-white bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
            title="Open in dedicated tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Tab</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative flex-1 w-full min-h-[620px] bg-black">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-950 font-mono text-xl font-black text-white">
              NX
              <div className="absolute inset-0 border-2 border-white animate-ping opacity-25" />
            </div>
            <p className="mt-4 font-['Syne',sans-serif] text-sm font-bold uppercase tracking-wider text-white">
              INITIALIZING {game.title}...
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500 uppercase tracking-widest">
              NEXXUS HIGH SPEED CACHE PROXY
            </p>
          </div>
        )}

        <iframe
          id="active-game-iframe"
          key={iframeKey}
          src={gameUrl}
          title={game.title}
          onLoad={() => setIsLoading(false)}
          className="h-full w-full border-0"
          style={{ minHeight: '620px', height: '100%', width: '100%' }}
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-downloads allow-modals"
        />
      </div>

      {/* Bottom Info & Related Games Bar */}
      <div className="border-t border-zinc-800 bg-zinc-950 p-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Controls hint */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-zinc-800 bg-black text-white">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-zinc-200 uppercase font-semibold">Standard Controls: </span>
              <span className="text-zinc-500">
                [WASD / Arrow Keys] Move &bull; [Space] Action / Jump &bull; [Mouse] Aim / Click &bull; [Esc / P] Pause
              </span>
            </div>
          </div>

          {/* Quick jump to similar titles */}
          {relatedGames.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                SIMILAR TITLES:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {relatedGames.map((rg) => (
                  <button
                    key={rg.id}
                    id={`similar-game-${rg.id}`}
                    onClick={() => onSelectGame(rg)}
                    className="rounded-sm border border-zinc-800 bg-black px-2 py-1 font-mono text-xs text-zinc-300 transition-colors hover:border-white hover:text-white"
                  >
                    {rg.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
