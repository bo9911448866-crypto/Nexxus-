import React from 'react';
import { Star, ExternalLink, Play, Gamepad2, Zap } from 'lucide-react';
import { Game } from '../types.ts';

interface GameListItemProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onSelectGame: (game: Game) => void;
  index: number;
}

export const GameListItem: React.FC<GameListItemProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  index,
}) => {
  const targetUrl = game.type === 'flash'
    ? `/games/${game.path}`
    : `/games/${game.path}/`;

  const handleExternalOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`game-list-row-${game.id}`}
      onClick={() => onSelectGame(game)}
      className="group flex items-center justify-between gap-3 border-b border-zinc-900 bg-black/60 px-3 py-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60 cursor-pointer"
    >
      {/* Left: Index + Mini Icon + Title + Aliases */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 font-mono text-xs text-zinc-600">
          {String(index + 1).padStart(3, '0')}
        </span>

        <button
          id={`star-row-${game.id}`}
          onClick={(e) => onToggleFavorite(e, game.id)}
          className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
            isFavorite
              ? 'text-white'
              : 'text-zinc-600 hover:text-zinc-300'
          }`}
          title={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-['Syne',sans-serif] text-sm font-bold text-white group-hover:text-white truncate">
              {game.title}
            </span>
            {game.featured && (
              <span className="hidden sm:inline-flex items-center gap-0.5 rounded-sm border border-white/20 bg-white/10 px-1 py-0.2 font-mono text-[9px] font-bold text-white uppercase">
                HOT
              </span>
            )}
          </div>
          {game.aliases && game.aliases.length > 0 && (
            <p className="font-mono text-[10px] text-zinc-500 truncate hidden md:block">
              aka: {game.aliases.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Right: Badges, Categories, Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Categories (hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-1.5">
          {game.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="rounded-sm border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 uppercase tracking-wider"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Type Badge */}
        <span
          className={`rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
            game.type === 'flash'
              ? 'border-zinc-700 bg-zinc-950 text-zinc-300'
              : 'border-zinc-800 bg-zinc-900 text-zinc-400'
          }`}
        >
          {game.type}
        </span>

        {/* External Link */}
        <button
          id={`tab-row-${game.id}`}
          onClick={handleExternalOpen}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-zinc-800 text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white"
          title="Open in new window"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>

        {/* Launch Button */}
        <button
          id={`launch-row-${game.id}`}
          className="hidden sm:flex items-center gap-1 rounded-sm border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black font-semibold"
        >
          <Play className="h-3 w-3 fill-current" />
          PLAY
        </button>
      </div>
    </div>
  );
};
