import React from 'react';
import { Play, Dices, Terminal, Flame, Zap, ShieldCheck } from 'lucide-react';
import { Game } from '../types.ts';

interface HeroBannerProps {
  onQuickPlay: () => void;
  onExplore: () => void;
  featuredGames: Game[];
  onSelectGame: (game: Game) => void;
  onPlayIntro?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onQuickPlay,
  onExplore,
  featuredGames,
  onSelectGame,
  onPlayIntro,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Main Title & Description */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-zinc-800 bg-black px-2.5 py-1 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              NEXXUS ARCHIVE SYSTEM &bull; 177 VERIFIED GAMES
            </div>

            <h1 className="mt-3 font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              UNRESTRICTED GAMING.
              <br />
              <span className="text-zinc-400">PURE MONOCHROME.</span>
            </h1>

            <p className="mt-3 max-w-xl font-mono text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every title from the legendary MonkeyGG2 repository preserved in an ultra-fast, high-contrast black and white nexus. Powered by local caching and direct browser execution.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                id="hero-quick-play-btn"
                onClick={onQuickPlay}
                className="flex items-center gap-2 rounded-sm border border-white bg-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <Dices className="h-4 w-4 fill-black" />
                RANDOM GAME
              </button>

              <button
                id="hero-explore-btn"
                onClick={onExplore}
                className="flex items-center gap-2 rounded-sm border border-zinc-800 bg-black px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <Zap className="h-4 w-4 text-zinc-400" />
                BROWSE 177 TITLES
              </button>

              {onPlayIntro && (
                <button
                  id="hero-play-intro-btn"
                  onClick={onPlayIntro}
                  className="flex items-center gap-2 rounded-sm border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-white hover:text-white"
                >
                  <Play className="h-3.5 w-3.5 text-zinc-400" />
                  REPLAY INTRO
                </button>
              )}
            </div>
          </div>

          {/* Quick-Pick Popular Highlights */}
          <div className="flex flex-col gap-2 rounded-sm border border-zinc-800/90 bg-black/80 p-4 min-w-[280px] sm:min-w-[320px] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                FEATURED HIGHLIGHTS
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                CLICK TO LAUNCH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {featuredGames.slice(0, 6).map((g) => (
                <button
                  key={g.id}
                  id={`hero-featured-${g.id}`}
                  onClick={() => onSelectGame(g)}
                  className="flex items-center justify-between rounded-sm border border-zinc-850 bg-zinc-950/80 px-2.5 py-2 text-left transition-all hover:border-zinc-400 hover:bg-zinc-900"
                >
                  <span className="font-mono text-xs font-semibold text-zinc-200 truncate">
                    {g.title}
                  </span>
                  <Play className="h-2.5 w-2.5 fill-zinc-400 text-zinc-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between pt-2 border-t border-zinc-900 font-mono text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-zinc-400" />
                100% UNBLOCKED
              </span>
              <span>71 FLASH &bull; 106 HTML5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
