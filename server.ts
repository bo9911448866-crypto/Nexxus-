import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// @ts-ignore
import wisp from "wisp-server-node";
import { createServer } from "node:http";
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.text({ type: ['text/*', 'application/json'] }));

// Disk cache directory for downloaded game assets & session logs
const CACHE_DIR = path.join(process.cwd(), '.cache', 'games');
const LOGS_FILE = path.join(process.cwd(), '.cache', 'sessions.json');
try {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
} catch (e) {
  // Ignore
}

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

// In-memory sessions store
let sessionsMap = new Map<string, VisitorSession>();

// Load persisted sessions on startup
try {
  if (fs.existsSync(LOGS_FILE)) {
    const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
    const parsed: VisitorSession[] = JSON.parse(raw);
    parsed.forEach((s) => {
      // Upon server start, mark previous active sessions as closed
      if (s.status === 'online') {
        s.status = 'closed';
        s.closedAt = s.lastHeartbeat || Date.now();
        s.durationSeconds = Math.max(1, Math.round(((s.closedAt || Date.now()) - s.openedAt) / 1000));
      }
      sessionsMap.set(s.id, s);
    });
  }
} catch (e) {
  console.warn('Failed to load sessions log:', e);
}

function persistSessions() {
  try {
    const list = Array.from(sessionsMap.values()).slice(-500); // keep last 500
    fs.writeFile(LOGS_FILE, JSON.stringify(list, null, 2), () => {});
  } catch {}
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  const raw = req.socket.remoteAddress || req.ip || '127.0.0.1';
  // Strip IPv6 prefix if mapped IPv4 (::ffff:192.168.1.1)
  return raw.replace(/^::ffff:/, '');
}

function parseUserAgentDetails(ua: string): { os: string; browser: string; device: string } {
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let device = 'Desktop PC';

  if (!ua) return { os, browser, device };

  // Detect OS
  if (/windows nt 10\.0/i.test(ua)) os = 'Windows 11 / 10';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone/i.test(ua)) {
    os = 'iOS';
    device = 'Apple iPhone';
  } else if (/ipad/i.test(ua)) {
    os = 'iPadOS';
    device = 'Apple iPad';
  } else if (/android/i.test(ua)) {
    os = 'Android';
    device = 'Android Device';
  } else if (/cros/i.test(ua)) {
    os = 'Chrome OS';
    device = 'Chromebook';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
    device = 'Linux Machine';
  }

  // Detect Browser
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';

  return { os, browser, device };
}

// Background cleanup: mark dead sessions as closed after 25 seconds of no heartbeat
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const session of sessionsMap.values()) {
    if (session.status === 'online' && now - session.lastHeartbeat > 25000) {
      session.status = 'closed';
      session.closedAt = session.lastHeartbeat;
      session.durationSeconds = Math.max(1, Math.round((session.closedAt - session.openedAt) / 1000));
      changed = true;
    }
  }
  if (changed) persistSessions();
}, 10000);

// Telemetry API: Session Open
app.post('/api/telemetry/open', (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const ua = req.headers['user-agent'] || '';
    const parsed = parseUserAgentDetails(ua);
    const ip = getClientIp(req);
    const now = Date.now();
    const id = body.id || `sess_${now}_${Math.random().toString(36).slice(2, 8)}`;

    const session: VisitorSession = {
      id,
      ip,
      device: body.deviceName || parsed.device,
      browser: body.browser || parsed.browser,
      os: body.os || parsed.os,
      openedAt: now,
      closedAt: null,
      lastHeartbeat: now,
      durationSeconds: 0,
      status: 'online',
      currentGame: body.currentGame || 'Viewing Library',
      screen: body.screen || 'Unknown',
      language: body.language || 'en',
    };

    sessionsMap.set(id, session);
    persistSessions();

    res.json({ success: true, sessionId: id });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Error recording session' });
  }
});

// Telemetry API: Session Heartbeat
app.post('/api/telemetry/heartbeat', (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};
    const id = body.id;

    if (!id || !sessionsMap.has(id)) {
      res.json({ success: false, message: 'Session not found' });
      return;
    }

    const session = sessionsMap.get(id)!;
    const now = Date.now();
    session.lastHeartbeat = now;
    session.status = 'online';
    session.durationSeconds = Math.max(1, Math.round((now - session.openedAt) / 1000));
    if (body.currentGame !== undefined) {
      session.currentGame = body.currentGame;
    }

    const wasKicked = Boolean(session.kicked);
    if (wasKicked) {
      session.kicked = false;
      session.currentGame = 'Viewing Library';
      persistSessions();
    }

    res.json({ success: true, duration: session.durationSeconds, kicked: wasKicked });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Telemetry API: Session Close (works with sendBeacon / fetch keepalive)
app.post('/api/telemetry/close', (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};
    const id = body.id;

    if (id && sessionsMap.has(id)) {
      const session = sessionsMap.get(id)!;
      const now = Date.now();
      session.status = 'closed';
      session.closedAt = now;
      session.durationSeconds = Math.max(1, Math.round((now - session.openedAt) / 1000));
      persistSessions();
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// Telemetry API: Get All Recorded Sessions (for Ctrl+O Dashboard)
app.get('/api/telemetry/sessions', (_req: Request, res: Response) => {
  try {
    const list = Array.from(sessionsMap.values()).sort((a, b) => b.openedAt - a.openedAt);
    const onlineCount = list.filter((s) => s.status === 'online').length;
    const uniqueIps = new Set(list.map((s) => s.ip)).size;

    const totalDuration = list.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const avgDuration = list.length > 0 ? Math.round(totalDuration / list.length) : 0;

    res.json({
      sessions: list,
      stats: {
        totalVisits: list.length,
        onlineNow: onlineCount,
        uniqueIps,
        avgDurationSeconds: avgDuration
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

// ==========================================
// ULTRAVIOLET MIDDLEWARE INTEGRATION
// ==========================================
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Combine Express and Wisp into an HTTP Server wrapper
const server = createServer(app);

// Handle the high-speed WebSocket protocol proxy streams
server.on("upgrade", (req, socket, head) => {
    if (req.url && req.url.startsWith("/wisp/")) {
        wisp.route(req, socket, head);
    } else {
        socket.end();
    }
});

// Start the combined server configuration
server.listen(PORT, () => {
  console.log(`Server successfully active on port ${PORT}`);
});
