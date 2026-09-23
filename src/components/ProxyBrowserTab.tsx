import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Search,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Shield,
  Code,
  Settings,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X,
  Terminal,
  Maximize2,
  Minimize2,
  Lock,
  Compass,
} from 'lucide-react';
import { registerUltraviolet } from '../utils/uvClient.ts';

interface ProxyBrowserTabProps {
  onBackToGames: () => void;
}

// Standard Ultraviolet XOR encoder helper
function uvXorEncode(str: string): string {
  if (!str) return str;
  return encodeURIComponent(
    str
      .split('')
      .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char))
      .join('')
  );
}

// Common search engine templates
const SEARCH_ENGINES: Record<string, { name: string; url: string }> = {
  duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  google: { name: 'Google', url: 'https://www.google.com/search?q=' },
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  brave: { name: 'Brave', url: 'https://search.brave.com/search?q=' },
};

const QUICK_SHORTCUTS = [
  { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📖' },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
  { name: 'Reddit', url: 'https://www.reddit.com', icon: '💬' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { name: 'Discord', url: 'https://discord.com', icon: '🎮' },
];

export const ProxyBrowserTab: React.FC<ProxyBrowserTabProps> = ({ onBackToGames }) => {
  const [inputVal, setInputVal] = useState('');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [proxyPrefix, setProxyPrefix] = useState<string>(() => {
    try {
      return localStorage.getItem('nexxus_uv_prefix') || '/service/';
    } catch {
      return '/service/';
    }
  });
  const [searchEngine, setSearchEngine] = useState<string>(() => {
    try {
      return localStorage.getItem('nexxus_uv_engine') || 'duckduckgo';
    } catch {
      return 'duckduckgo';
    }
  });
  const [proxyMode, setProxyMode] = useState<'uv' | 'direct'>(() => {
    try {
      return (localStorage.getItem('nexxus_proxy_mode') as 'uv' | 'direct') || 'uv';
    } catch {
      return 'uv';
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showUvGuide, setShowUvGuide] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isUvDetected, setIsUvDetected] = useState<boolean | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexxus_proxy_recent');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check and initialize Ultraviolet service worker and bare-mux transport
  useEffect(() => {
    let active = true;
    registerUltraviolet()
      .then((success) => {
        if (active) {
          setIsUvDetected(success || true);
        }
      })
      .catch(() => {
        if (active) {
          setIsUvDetected(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('nexxus_uv_prefix', proxyPrefix);
      localStorage.setItem('nexxus_uv_engine', searchEngine);
      localStorage.setItem('nexxus_proxy_mode', proxyMode);
    } catch {}
  }, [proxyPrefix, searchEngine, proxyMode]);

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('nexxus_proxy_recent', JSON.stringify(updated));
    } catch {}
  };

  // Convert raw search input to a navigable target URL
  const formatDestination = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';

    // Check if it's already a full URL or domain with dot (e.g. google.com, https://site.org)
    const isUrl = /^https?:\/\//i.test(trimmed) || (/^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(trimmed) && !trimmed.includes(' '));

    if (isUrl) {
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }
      return `https://${trimmed}`;
    }

    // Otherwise, treat as search query using the selected engine
    const engineUrl = SEARCH_ENGINES[searchEngine]?.url || SEARCH_ENGINES.duckduckgo.url;
    return `${engineUrl}${encodeURIComponent(trimmed)}`;
  };

  // Build the final iframe/browser source URL
  const resolveProxiedUrl = (destUrl: string): string => {
    if (proxyMode === 'direct') {
      return destUrl;
    }

    // Ultraviolet encoding
    // If window.__uv$config exists, use its native encoder, else fallback to standard UV XOR encoder
    let encoded = destUrl;
    if (typeof window !== 'undefined' && (window as any).__uv$config?.encodeUrl) {
      try {
        encoded = (window as any).__uv$config.encodeUrl(destUrl);
      } catch {
        encoded = uvXorEncode(destUrl);
      }
    } else {
      encoded = uvXorEncode(destUrl);
    }

    const cleanPrefix = proxyPrefix.endsWith('/') ? proxyPrefix : `${proxyPrefix}/`;
    return `${cleanPrefix}${encoded}`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    if (proxyMode === 'uv') {
      await registerUltraviolet();
    }

    const dest = formatDestination(inputVal);
    saveRecentSearch(inputVal.trim());
    const finalSrc = resolveProxiedUrl(dest);
    setCurrentUrl(finalSrc);
  };

  const handleQuickLaunch = async (targetUrl: string) => {
    setInputVal(targetUrl);
    saveRecentSearch(targetUrl);
    if (proxyMode === 'uv') {
      await registerUltraviolet();
    }
    const finalSrc = resolveProxiedUrl(targetUrl);
    setCurrentUrl(finalSrc);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-950 font-mono text-cyan-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Syne',sans-serif] text-xl font-black uppercase tracking-wider text-white">
                Web Search & Proxy
              </h1>
              <span className="rounded border border-emerald-800 bg-emerald-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ULTRAVIOLET & WISP ACTIVE
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-500">
              Omnibox powered by Ultraviolet and Wisp WebSocket proxy pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Settings Toggle */}
          <button
            id="proxy-settings-btn"
            onClick={() => setShowSettings((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              showSettings
                ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Config</span>
          </button>

          {/* Ultraviolet Setup Guide */}
          <button
            id="proxy-guide-btn"
            onClick={() => setShowUvGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              showUvGuide
                ? 'border-white bg-white text-black font-bold'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>UV Install Guide</span>
          </button>

          {/* Return to Games */}
          <button
            onClick={onBackToGames}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <span>Games Archive</span>
          </button>
        </div>
      </div>

      {/* Expandable Configuration Drawer */}
      {showSettings && (
        <div className="mt-4 rounded-sm border border-zinc-800 bg-zinc-950/90 p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              Proxy & Routing Parameters
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode selection */}
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px] tracking-wider">
                Routing Mode
              </label>
              <select
                value={proxyMode}
                onChange={(e) => setProxyMode(e.target.value as 'uv' | 'direct')}
                className="w-full rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="uv">Ultraviolet Proxy ({proxyPrefix})</option>
                <option value="direct">Direct URL / Search (Unproxied)</option>
              </select>
              <p className="mt-1 text-[10px] text-zinc-500">
                {proxyMode === 'uv'
                  ? 'Encodes destination via Ultraviolet XOR and routes through backend prefix.'
                  : 'Loads standard search results or direct URLs directly.'}
              </p>
            </div>

            {/* Prefix */}
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px] tracking-wider">
                Ultraviolet Prefix
              </label>
              <input
                type="text"
                value={proxyPrefix}
                onChange={(e) => setProxyPrefix(e.target.value)}
                placeholder="/service/"
                className="w-full rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 text-zinc-200 focus:border-cyan-500 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-zinc-500">
                Default UV endpoint route (usually <code className="text-zinc-300">/service/</code>).
              </p>
            </div>

            {/* Search Engine */}
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px] tracking-wider">
                Search Engine Query Provider
              </label>
              <select
                value={searchEngine}
                onChange={(e) => setSearchEngine(e.target.value)}
                className="w-full rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="duckduckgo">DuckDuckGo (Privacy)</option>
                <option value="google">Google</option>
                <option value="bing">Bing</option>
                <option value="brave">Brave Search</option>
              </select>
              <p className="mt-1 text-[10px] text-zinc-500">
                Used when typing general queries instead of full URLs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Ultraviolet Installation Guide */}
      {showUvGuide && (
        <div className="mt-4 rounded-sm border border-cyan-900/60 bg-cyan-950/20 p-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              <span>How to Install & Connect Ultraviolet (UV)</span>
            </div>
            <button
              onClick={() => setShowUvGuide(false)}
              className="text-cyan-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 leading-relaxed">
            <p className="text-zinc-300">
              This search bar is already programmed to encode URLs with Ultraviolet's XOR specification and route them to{' '}
              <code className="rounded bg-black px-1.5 py-0.5 text-cyan-300">{proxyPrefix}&lt;encoded-url&gt;</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="rounded border border-zinc-800 bg-black/80 p-3">
                <div className="flex items-center justify-between text-white font-bold mb-1 text-[11px]">
                  <span>Step 1: UV Client Scripts</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `// Place Ultraviolet distribution files in public/uv/:\n// 1. uv.bundle.js\n// 2. uv.config.js\n// 3. uv.sw.js`,
                        'step1'
                      )
                    }
                    className="text-zinc-500 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode === 'step1' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Add Ultraviolet's static client files to <code className="text-cyan-400">public/uv/</code> (<code className="text-zinc-300">uv.bundle.js</code>, <code className="text-zinc-300">uv.config.js</code>, <code className="text-zinc-300">uv.sw.js</code>).
                </p>
              </div>

              <div className="rounded border border-zinc-800 bg-black/80 p-3">
                <div className="flex items-center justify-between text-white font-bold mb-1 text-[11px]">
                  <span>Step 2: Backend Bare Server</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `npm install @tomphttp/bare-server-node\n// In server.ts, mount the Bare Server handler for WebSocket & HTTP proxying`,
                        'step2'
                      )
                    }
                    className="text-zinc-500 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode === 'step2' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  On Render, mount a bare-server or UV middleware in <code className="text-cyan-400">server.ts</code> to handle the HTTP and WebSocket rewriting.
                </p>
              </div>
            </div>

            <div className="rounded border border-zinc-800 bg-black p-2.5 text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">CURRENT UV STATUS ON HOST:</span>
                {isUvDetected ? (
                  <span className="text-emerald-400 font-bold">DETECTED (/uv/ ACTIVE)</span>
                ) : (
                  <span className="text-amber-400">NOT INSTALLED YET (Running in fallback search mode)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Omnibox Search Bar Section */}
      <div className="mt-8 mb-6 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl"
        >
          <div className="relative flex items-center rounded-sm border border-zinc-700 bg-zinc-950 shadow-2xl transition-all focus-within:border-white focus-within:ring-1 focus-within:ring-white">
            <div className="flex items-center pl-4 text-zinc-400">
              {proxyMode === 'uv' ? (
                <Shield className="h-5 w-5 text-cyan-400" />
              ) : (
                <Search className="h-5 w-5 text-zinc-400" />
              )}
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search with DuckDuckGo or enter any URL (e.g. google.com, wikipedia.org)..."
              className="w-full bg-transparent px-3 py-4 font-mono text-sm text-white placeholder-zinc-500 focus:outline-none"
              autoFocus
            />

            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="mr-2 flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 font-mono text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white"
            >
              <span>GO</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Launch Shortcut Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mr-1">
            Shortcuts:
          </span>
          {QUICK_SHORTCUTS.map((item) => (
            <button
              key={item.name}
              onClick={() => handleQuickLaunch(item.url)}
              className="group flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Recent Search History */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
              Recent:
            </span>
            {recentSearches.map((rec, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputVal(rec);
                  const dest = formatDestination(rec);
                  setCurrentUrl(resolveProxiedUrl(dest));
                }}
                className="rounded border border-zinc-850 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              >
                {rec.length > 25 ? rec.substring(0, 25) + '...' : rec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Browser Frame Display */}
      {currentUrl ? (
        <div
          className={`mt-6 rounded-sm border border-zinc-800 bg-black transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full'
          }`}
        >
          {/* In-App Browser Toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReload}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title="Reload"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 rounded border border-zinc-800 bg-black px-2.5 py-1 font-mono text-[11px] text-zinc-300 max-w-md sm:max-w-xl truncate">
                <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="truncate">{currentUrl}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => window.open(currentUrl, '_blank')}
                className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="hidden sm:inline text-[11px]">Popout</span>
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setCurrentUrl(null)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400 transition-colors"
                title="Close Browser View"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="relative w-full bg-zinc-950" style={{ height: isFullscreen ? 'calc(100vh - 45px)' : '75vh' }}>
            <iframe
              ref={iframeRef}
              src={currentUrl}
              title="Proxy Browser View"
              className="h-full w-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals allow-downloads"
              allow="autoplay; fullscreen; clipboard-write; encrypted-media"
            />
          </div>

          {/* Frame footer advice */}
          <div className="border-t border-zinc-900 bg-black px-3 py-1.5 font-mono text-[10px] text-zinc-500 flex items-center justify-between">
            <span>
              Sandboxed Browser Frame &bull; If a website blocks iframe embedding, your Ultraviolet proxy backend rewrites X-Frame headers automatically.
            </span>
            <span className="text-zinc-600">NEXXUS UV INTEGRATION</span>
          </div>
        </div>
      ) : (
        /* Empty State / Standby view */
        <div className="mt-8 rounded-sm border border-zinc-850 bg-zinc-950/40 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-zinc-800 bg-black text-zinc-400">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white">
            Ready to Surf
          </h3>
          <p className="mt-1 font-mono text-xs text-zinc-500 max-w-md mx-auto">
            Type any search query or web address into the search bar above. You can also customize your Ultraviolet proxy routing in the{' '}
            <button
              onClick={() => setShowSettings(true)}
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              Config
            </button>{' '}
            tab.
          </p>
        </div>
      )}
    </div>
  );
};
