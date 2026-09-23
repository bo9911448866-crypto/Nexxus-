// Client-side Ultraviolet and BareMux/Wisp registration manager

let uvInitPromise: Promise<boolean> | null = null;

export async function registerUltraviolet(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  if (uvInitPromise) return uvInitPromise;

  uvInitPromise = (async () => {
    try {
      // 1. Initialize BareMux with Epoxy transport and Wisp backend
      try {
        // Dynamic import of baremux ES module
        // @ts-ignore
        const { BareMuxConnection } = await import(/* @vite-ignore */ '/baremux/index.mjs');
        const connection = new BareMuxConnection('/baremux/worker.js');
        const wispProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wispUrl = `${wispProto}//${window.location.host}/wisp/`;
        await connection.setTransport('/epoxy/index.mjs', [{ wisp: wispUrl }]);
      } catch (bmErr) {
        console.warn('Bare-Mux transport note:', bmErr);
      }

      // 2. Register Service Worker with scope /service/
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/service/',
      });
      
      // Wait for service worker to become active
      await navigator.serviceWorker.ready;

      return !!registration;
    } catch (err) {
      console.warn('Ultraviolet ServiceWorker registration error:', err);
      return false;
    }
  })();

  return uvInitPromise;
}
