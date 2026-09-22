import React, { useState } from 'react';
import { Star, ExternalLink, Play, Gamepad2, Zap } from 'lucide-react';
import { Game } from '../types.ts';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onSelectGame: (game: Game) => void;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  index,
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive target URL
  const targetUrl = game.type === 'flash'
    ? `/games/${game.path}`
    : `/games/${game.path}/`;

  const handleExternalOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-zinc-800/80 bg-zinc-950 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-900/90 hover:shadow-[0_4px_24px_rgba(255,255,255,0.08)] cursor-pointer"
    >
      {/* Thumbnail or Monogram Graphic Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black border-b border-zinc-900">
        {game.thumbnail && !imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:12px_12px] p-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-zinc-500 group-hover:text-white transition-colors">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="mt-2 font-['Syne',sans-serif] text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200">
              {game.title.slice(0, 18)}
            </span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <span
            className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
              game.type === 'flash'
                ? 'border border-zinc-700 bg-black/80 text-zinc-300'
                : 'border border-zinc-700 bg-zinc-950/80 text-zinc-300'
            }`}
          >
            {game.type.toUpperCase()}
          </span>
          {game.featured && (
            <span className="flex items-center gap-1 rounded-sm border border-white/40 bg-white px-1.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-black">
              <Zap className="h-2.5 w-2.5 fill-black" />
              HOT
            </span>
          )}
        </div>

        {/* Top Right Actions (Star + External Link) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button
            id={`star-btn-${game.id}`}
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-sm border backdrop-blur-sm transition-all ${
              isFavorite
                ? 'border-white bg-white text-black'
                : 'border-zinc-800 bg-black/60 text-zinc-400 hover:border-zinc-600 hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-black' : ''}`} />
          </button>
          <button
            id={`tab-btn-${game.id}`}
            onClick={handleExternalOpen}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-zinc-800 bg-black/60 text-zinc-400 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white"
            title="Launch in dedicated new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        {/* Hover Play Button Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-1.5 rounded-sm border border-white bg-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-lg">
            <Play className="h-3 w-3 fill-black" />
            PLAY
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <h3 className="font-['Syne',sans-serif] text-sm font-bold tracking-tight text-white group-hover:text-white line-clamp-1">
            {game.title}
          </h3>
          {/* Categories */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {game.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider"
              >
                #{cat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom index / identifier footer */}
        <div className="mt-2.5 flex items-center justify-between border-t border-zinc-900 pt-2 font-mono text-[10px] text-zinc-600">
          <span>NO. {String(index + 1).padStart(3, '0')}</span>
          <span className="text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest transition-colors">
            LAUNCH ▶
          </span>
        </div>
      </div>
    </div>
  );
};
