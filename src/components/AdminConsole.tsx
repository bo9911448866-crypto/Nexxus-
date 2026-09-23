import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  Clock,
  Laptop,
  Globe,
  RefreshCw,
  Trash2,
  Download,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Monitor,
  Activity,
  Terminal,
  UserX,
} from 'lucide-react';
import { telemetry } from '../utils/telemetry.ts';

export interface VisitorSession {
  id: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  openedAt: number;
  closedAt: number | null;
  lastHeartbeat: number;
  durationSeconds: number;
  status: 'online' | 'closed';
  currentGame?: string;
  screen?: string;
  language?: string;
  kicked?: boolean;
}

interface AdminConsoleProps {
  onClose: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    onlineNow: 0,
    uniqueIps: 0,
    avgDurationSeconds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'closed'>('all');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<VisitorSession | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [kickingId, setKickingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const currentSessionId = telemetry.getSessionId();

  const handleKick = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setKickingId(id);
    try {
      const res = await fetch('/api/telemetry/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setActionFeedback('Visitor kicked from game back to the home page (silent).');
        setTimeout(() => setActionFeedback(null), 3500);
        fetchSessions();
        if (selectedSession && selectedSession.id === id) {
          setSelectedSession((prev) => (prev ? { ...prev, currentGame: 'Viewing Library' } : null));
        }
      }
    } catch {
      setActionFeedback('Failed to execute kick action.');
    } finally {
      setKickingId(null);
    }
  };

  const handleKickAll = async () => {
    if (!confirm('Silently kick ALL active visitors from their games to the home page?')) return;
    try {
      const res = await fetch('/api/telemetry/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setActionFeedback('All active players kicked to the home page.');
        setTimeout(() => setActionFeedback(null), 3500);
        fetchSessions();
      }
    } catch {
      setActionFeedback('Failed to execute kick all.');
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/telemetry/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        if (data.stats) setStats(data.stats);
        setLastRefreshedAt(new Date());
      }
    } catch (e) {
      console.warn('Failed to fetch telemetry data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Polling interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchSessions();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedSession) {
          setSelectedSession(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedSession, onClose]);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all visitor session logs?')) return;
    try {
      const res = await fetch('/api/telemetry/sessions', { method: 'DELETE' });
      if (res.ok) {
        telemetry.resetSession();
        setSessions([]);
        setStats({ totalVisits: 0, onlineNow: 0, uniqueIps: 0, avgDurationSeconds: 0 });
        setSelectedSession(null);
        setActionFeedback('All logs cleared. Ready for fresh visits.');
        setTimeout(() => setActionFeedback(null), 3500);
      }
    } catch (e) {
      console.error(e);
      setActionFeedback('Failed to clear logs.');
    }
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexxus_visitor_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '< 1s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' (' + date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')';
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.ip.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q) ||
        s.os.toLowerCase().includes(q) ||
        s.browser.toLowerCase().includes(q) ||
        (s.currentGame && s.currentGame.toLowerCase().includes(q))
      );
    });
  }, [sessions, statusFilter, searchQuery]);

  return (
    <div
      id="nexxus-admin-page"
      className="fixed inset-0 z-50 flex flex-col bg-black text-zinc-100 overflow-y-auto selection:bg-white selection:text-black font-sans"
    >
      {/* Top Cyber Command Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-700 bg-black font-mono font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Syne',sans-serif] text-base font-extrabold uppercase tracking-widest text-white">
                  NEXXUS // VISITOR INTELLIGENCE CONSOLE
                </h1>
                <span className="rounded border border-emerald-800/80 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                ACTIVE MONITOR &bull; OPEN/CLOSE TIMESTAMPS &bull; IP & DEVICE DETECTION &bull; PRESS [SHIFT + O] OR [ESC] TO EXIT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Refresh Toggle */}
            <button
              id="admin-auto-refresh-toggle"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                autoRefresh
                  ? 'border-zinc-700 bg-zinc-900 text-zinc-200'
                  : 'border-zinc-800 bg-black text-zinc-500 hover:text-zinc-300'
              }`}
              title="Live 3s Polling"
            >
              <Radio className={`h-3 w-3 ${autoRefresh ? 'text-emerald-400 animate-pulse' : ''}`} />
              <span className="hidden md:inline">{autoRefresh ? 'POLLING ON' : 'PAUSED'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              id="admin-refresh-btn"
              onClick={fetchSessions}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-black text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
              title="Refresh logs immediately"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Export */}
            <button
              id="admin-export-btn"
              onClick={handleExportJson}
              className="hidden sm:flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              title="Export sessions to JSON"
            >
              <Download className="h-3.5 w-3.5" />
              <span>EXPORT</span>
            </button>

            {/* Kick All */}
            <button
              id="admin-kick-all-btn"
              onClick={handleKickAll}
              className="hidden sm:flex items-center gap-1.5 rounded-sm border border-red-900/80 bg-red-950/40 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-red-300 transition-colors hover:bg-red-900/50 hover:border-red-600 hover:text-white"
              title="Kick all active players back to home page silently"
            >
              <UserX className="h-3.5 w-3.5" />
              <span>KICK ALL</span>
            </button>

            {/* Clear Logs */}
            <button
              id="admin-clear-btn"
              onClick={handleClearLogs}
              className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-400 transition-colors hover:border-red-900 hover:text-red-400"
              title="Clear all recorded logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">CLEAR</span>
            </button>

            {/* Close / Return Button */}
            <button
              id="admin-close-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-sm border border-white bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 active:scale-95"
              title="Return to Nexxus [ESC]"
            >
              <X className="h-3.5 w-3.5" />
              <span>CLOSE</span>
              <span className="hidden sm:inline text-[10px] text-zinc-600">[ESC]</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="mb-4 flex items-center justify-between rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-zinc-100 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-zinc-500 hover:text-white p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-6">
          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                ACTIVE ONLINE NOW
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Syne',sans-serif] text-3xl font-black text-white">
                {stats.onlineNow}
              </span>
              <span className="font-mono text-xs text-emerald-400">VISITORS</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              Live tabs connected
            </p>
          </div>

          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                TOTAL RECORDED SESSIONS
              </span>
              <Activity className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Syne',sans-serif] text-3xl font-black text-white">
                {stats.totalVisits}
              </span>
              <span className="font-mono text-xs text-zinc-400">TOTAL</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              Opens recorded on server
            </p>
          </div>

          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                UNIQUE IP ADDRESSES
              </span>
              <Globe className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Syne',sans-serif] text-3xl font-black text-white">
                {stats.uniqueIps}
              </span>
              <span className="font-mono text-xs text-zinc-400">IPS</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              Distinct client networks
            </p>
          </div>

          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                AVG SESSION DURATION
              </span>
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-['Syne',sans-serif] text-3xl font-black text-white">
                {formatDuration(stats.avgDurationSeconds)}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              Average engagement time
            </p>
          </div>
        </div>

        {/* Owner Self-Testing Notice */}
        <div className="rounded-sm border border-cyan-900/60 bg-cyan-950/20 p-3 mb-6 text-xs font-mono text-cyan-300 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-cyan-200">Where these logs come from: </span>
            <span>
              The sessions below are <strong>real logs from your own browser testing sessions</strong> (tagged with <span className="text-white font-bold underline">YOU (THIS TAB)</span>). No bots or fake visitors are generated. Every time you opened, refreshed, or tested games like Geometry Dash Lite, your browser recorded that visit. Click <strong className="text-white">CLEAR</strong> in the top-right bar anytime to reset the history before sharing your link!
            </span>
          </div>
        </div>

        {/* Technical Explainer Note */}
        <div className="rounded-sm border border-zinc-800 bg-zinc-950/60 p-3.5 mb-6 text-xs font-mono text-zinc-400 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Monitor className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-zinc-200 font-semibold uppercase">How Tracking Works: </span>
              <span>
                Entry is detected on page initialization, exit is registered via <code className="text-zinc-300">sendBeacon</code> and a 25s inactivity heartbeat. IP address is captured via standard HTTP headers (<code className="text-zinc-300">x-forwarded-for</code>). Device name and OS are detected via client environment & User Agent.
              </span>
            </div>
          </div>
          <div className="shrink-0 text-[11px] text-zinc-500">
            Last updated: {lastRefreshedAt.toLocaleTimeString()}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by IP, Device, OS, or Game..."
              className="w-full rounded-sm border border-zinc-800 bg-black py-2 pl-9 pr-4 font-mono text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'online', 'closed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  statusFilter === filter
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {filter === 'all' ? 'All Sessions' : filter === 'online' ? 'Online Only' : 'Closed Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Data Table */}
        <div className="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/80 text-[11px] uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Device Model / Name</th>
                  <th className="py-3 px-4">OS & Browser</th>
                  <th className="py-3 px-4">Opened At (Entry)</th>
                  <th className="py-3 px-4">Closed At (Exit)</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4 text-center">Kick Action</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-zinc-500">
                      {sessions.length === 0
                        ? 'No visitor sessions recorded yet. Open Nexxus in another tab or device to see live logs.'
                        : 'No sessions match your search filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((s) => {
                    const isOnline = s.status === 'online';
                    const isMySession = s.id === currentSessionId;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className={`group transition-colors cursor-pointer ${
                          isMySession ? 'bg-cyan-950/20 hover:bg-cyan-950/40' : 'hover:bg-zinc-900/60'
                        }`}
                      >
                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-800/60 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                ONLINE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black px-2 py-0.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                                CLOSED
                              </span>
                            )}
                            {isMySession && (
                              <span className="inline-flex items-center rounded-sm border border-cyan-800/80 bg-cyan-950/80 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                                YOU (THIS TAB)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* IP Address */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-200">{s.ip}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyIp(s.ip);
                              }}
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                              title="Copy IP"
                            >
                              {copiedIp === s.ip ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Device Name */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Laptop className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                            <span className="text-white font-medium">{s.device}</span>
                          </div>
                        </td>

                        {/* OS & Browser */}
                        <td className="py-3 px-4 whitespace-nowrap text-zinc-400">
                          <span>{s.os}</span> &bull; <span className="text-zinc-500">{s.browser}</span>
                        </td>

                        {/* Opened At */}
                        <td className="py-3 px-4 whitespace-nowrap text-zinc-300">
                          {formatDateTime(s.openedAt)}
                        </td>

                        {/* Closed At */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isOnline ? (
                            <span className="text-emerald-400 font-semibold animate-pulse">
                              Active Now
                            </span>
                          ) : (
                            <span className="text-zinc-400">{formatDateTime(s.closedAt)}</span>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-zinc-300">
                          {formatDuration(s.durationSeconds)}
                        </td>

                        {/* Activity */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="rounded-sm border border-zinc-800 bg-black px-1.5 py-0.5 text-[10px] text-zinc-400 uppercase">
                            {s.currentGame || 'Browsing Library'}
                          </span>
                        </td>

                        {/* Kick Player from Game */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          {isMySession ? (
                            <span className="text-[10px] font-mono text-zinc-500 italic">
                              YOUR TAB
                            </span>
                          ) : isOnline ? (
                            <button
                              onClick={(e) => handleKick(s.id, e)}
                              disabled={kickingId === s.id}
                              className="inline-flex items-center gap-1.5 rounded-sm border border-red-900/80 bg-red-950/40 px-2.5 py-1 text-[10px] font-bold text-red-300 uppercase tracking-wider hover:bg-red-900/60 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
                              title="Silently kick player back to home page"
                            >
                              <UserX className="h-3 w-3" />
                              <span>{kickingId === s.id ? 'KICKING...' : 'KICK TO HOME'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-600 uppercase">
                              OFFLINE
                            </span>
                          )}
                        </td>

                        {/* Details */}
                        <td className="py-3 px-4 text-right whitespace-nowrap text-zinc-500 group-hover:text-white">
                          <ChevronRight className="h-4 w-4 inline" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal / Drawer for detailed session info */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-sm border border-zinc-700 bg-zinc-950 p-6 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white">
                    SESSION INSPECTOR // {selectedSession.id}
                  </h3>
                  <p className="text-[10px] text-zinc-500">RAW TELEMETRY RECORD</p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-sm p-1 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {selectedSession.id === currentSessionId && (
                  <div className="rounded border border-cyan-800/80 bg-cyan-950/50 p-2 text-cyan-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>THIS IS YOUR CURRENT BROWSER SESSION (YOU / ADMIN)</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">STATUS:</span>
                  <span className={selectedSession.status === 'online' ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                    {selectedSession.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">IP ADDRESS:</span>
                  <span className="text-white font-bold">{selectedSession.ip}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">DEVICE MODEL:</span>
                  <span className="text-white">{selectedSession.device}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">OPERATING SYSTEM:</span>
                  <span className="text-white">{selectedSession.os}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">BROWSER & VERSION:</span>
                  <span className="text-white">{selectedSession.browser}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">SCREEN RESOLUTION:</span>
                  <span className="text-zinc-300">{selectedSession.screen || 'Unknown'}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">LANGUAGE:</span>
                  <span className="text-zinc-300">{selectedSession.language || 'en'}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">PAGE OPENED AT:</span>
                  <span className="text-zinc-300">{new Date(selectedSession.openedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">PAGE CLOSED AT:</span>
                  <span className="text-zinc-300">
                    {selectedSession.closedAt ? new Date(selectedSession.closedAt).toLocaleString() : 'Currently Active'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">TOTAL DURATION:</span>
                  <span className="text-white font-bold">{formatDuration(selectedSession.durationSeconds)}</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="text-zinc-500">LAST KNOWN ACTIVITY:</span>
                  <span className="text-zinc-200">{selectedSession.currentGame || 'Browsing Library'}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                {selectedSession.status === 'online' ? (
                  <button
                    onClick={() => handleKick(selectedSession.id)}
                    disabled={kickingId === selectedSession.id}
                    className="flex items-center gap-1.5 rounded-sm border border-red-800 bg-red-950/80 px-3 py-1.5 font-mono text-xs font-bold text-red-200 hover:bg-red-900 hover:border-red-600 uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    <span>{kickingId === selectedSession.id ? 'Kicking...' : 'Kick from Game to Home'}</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-1.5 font-mono text-xs text-white hover:border-white uppercase"
                >
                  CLOSE INSPECTOR
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
