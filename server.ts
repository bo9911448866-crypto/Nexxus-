import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Disk cache directory for downloaded game assets
const CACHE_DIR = path.join(process.cwd(), '.cache', 'games');
try {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
} catch (e) {
  // Ignore
}

// MIME types lookup
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jsonc': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
  '.swf': 'application/x-shockwave-flash',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.data': 'application/octet-stream',
  '.mem': 'application/octet-stream',
  '.bin': 'application/octet-stream',
  '.unityweb': 'application/octet-stream',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath.split('?')[0]).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Basic health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Proxy for games from gitlab
app.get('/games/*', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSubpath = req.params[0] || '';
    // Clean query params for file lookup
    const cleanSubpath = rawSubpath.split('?')[0];

    // If accessing a directory without a trailing slash and without an extension, redirect to trailing slash
    if (!cleanSubpath.includes('.') && !rawSubpath.endsWith('/')) {
      const originalQuery = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      res.redirect(301, `/games/${rawSubpath}/${originalQuery}`);
      return;
    }

    // Determine target file inside the gitlab repo games/ folder
    let targetRelativePath = cleanSubpath;
    if (cleanSubpath === '' || cleanSubpath.endsWith('/')) {
      targetRelativePath = path.join(cleanSubpath, 'index.html');
    }

    // Normalize path to prevent traversal
    const normalized = path.normalize(targetRelativePath).replace(/^(\.\.[\/\\])+/, '');
    const localCachePath = path.join(CACHE_DIR, normalized);

    // Set CORS headers so game iframe & web workers can fetch assets freely
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    // Check if file exists in local disk cache
    if (fs.existsSync(localCachePath)) {
      const stats = fs.statSync(localCachePath);
      if (stats.isFile()) {
        const mime = getMimeType(normalized);
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        const readStream = fs.createReadStream(localCachePath);
        readStream.pipe(res);
        return;
      }
    }

    // Otherwise fetch from GitLab raw repo
    const gitlabUrl = `https://gitlab.com/barryjensen-dev/monkeygg2/-/raw/main/games/${encodeURI(normalized)}`;
    const upstreamRes = await fetch(gitlabUrl);

    if (!upstreamRes.ok) {
      // If index.html wasn't found, try without it or 404
      res.status(upstreamRes.status).send(`Failed to load asset from GitLab (${upstreamRes.status})`);
      return;
    }

    const mime = getMimeType(normalized);
    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Read buffer and save to cache
    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save asynchronously to cache
    try {
      const parentDir = path.dirname(localCachePath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFile(localCachePath, buffer, () => {});
    } catch (cacheErr) {
      console.warn('Cache write failed for', normalized, cacheErr);
    }

    res.send(buffer);
  } catch (err: any) {
    console.error('Error in /games proxy:', err);
    res.status(500).send('Internal game proxy error: ' + (err?.message || 'unknown'));
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexxus Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
