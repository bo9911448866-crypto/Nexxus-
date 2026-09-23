import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const destination = 'https://nexxus.live';

function retiredPage(_req: express.Request, res: express.Response) {
  res.status(301).set('Location', destination).type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="1;url=${destination}" />
    <title>Website moved</title>
    <style>
      body { display: grid; min-height: 100vh; place-items: center; margin: 0; background: #09090b; color: #fafafa; font: 16px system-ui, sans-serif; text-align: center; }
      main { padding: 2rem; }
      a { color: inherit; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>This website is no longer active.</h1>
      <p>There is a new domain: <a href="${destination}">nexxus.live</a></p>
      <p>Redirecting you now…</p>
    </main>
    <script>window.setTimeout(() => window.location.replace(${JSON.stringify(destination)}), 1000)</script>
  </body>
</html>`);
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(retiredPage);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Retired-site redirect running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
