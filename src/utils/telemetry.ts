// Client-side visitor telemetry tracker for Nexxus

export interface ClientDeviceInfo {
  deviceName: string;
  os: string;
  browser: string;
  screen: string;
  language: string;
}

export function detectClientDevice(): ClientDeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceName: 'Unknown Device',
      os: 'Unknown OS',
      browser: 'Unknown Browser',
      screen: 'Unknown',
      language: 'en',
    };
  }

  const ua = navigator.userAgent || '';
  const screen = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || 'en';

  let os = 'Unknown OS';
  let deviceName = 'Desktop PC';

  // Check iOS
  if (/iPhone/i.test(ua)) {
    os = 'iOS';
    deviceName = 'Apple iPhone';
  } else if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    os = 'iPadOS';
    deviceName = 'Apple iPad';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS';
    deviceName = 'Apple Mac / MacBook';
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 11 / 10';
    deviceName = 'Windows PC';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
    deviceName = 'Windows PC';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    // Check if Samsung, Pixel, etc.
    if (/samsung|sm-/i.test(ua)) deviceName = 'Samsung Galaxy Device';
    else if (/pixel/i.test(ua)) deviceName = 'Google Pixel Device';
    else deviceName = 'Android Phone / Tablet';
  } else if (/CrOS/i.test(ua)) {
    os = 'ChromeOS';
    deviceName = 'Chromebook';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    deviceName = 'Linux Workstation';
  }

  // Detect Browser
  let browser = 'Unknown Browser';
  if (/Edg\//i.test(ua)) {
    const match = ua.match(/Edg\/([\d\.]+)/);
    browser = `Edge ${match ? match[1].split('.')[0] : ''}`;
  } else if (/OPR\//i.test(ua)) {
    const match = ua.match(/OPR\/([\d\.]+)/);
    browser = `Opera ${match ? match[1].split('.')[0] : ''}`;
  } else if (/Chrome\//i.test(ua)) {
    const match = ua.match(/Chrome\/([\d\.]+)/);
    browser = `Chrome ${match ? match[1].split('.')[0] : ''}`;
  } else if (/Firefox\//i.test(ua)) {
    const match = ua.match(/Firefox\/([\d\.]+)/);
    browser = `Firefox ${match ? match[1].split('.')[0] : ''}`;
  } else if (/Safari\//i.test(ua)) {
    const match = ua.match(/Version\/([\d\.]+)/);
    browser = `Safari ${match ? match[1].split('.')[0] : ''}`;
  }

  return {
    deviceName,
    os,
    browser,
    screen,
    language,
  };
}

class TelemetryClient {
  private sessionId: string | null = null;
  private currentGame: string = 'Browsing Library';
  private heartbeatInterval: number | null = null;
  private kickCallbacks: Array<() => void> = [];
  private isInitialized: boolean = false;

  public getSessionId() {
    if (!this.sessionId && typeof window !== 'undefined') {
      try {
        this.sessionId = sessionStorage.getItem('nexxus_session_id');
      } catch {}
    }
    return this.sessionId;
  }

  public onKick(callback: () => void) {
    this.kickCallbacks.push(callback);
    return () => {
      this.kickCallbacks = this.kickCallbacks.filter((cb) => cb !== callback);
    };
  }

  private triggerKick() {
    this.currentGame = 'Browsing Library';
    this.kickCallbacks.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nexxus:silent-kick'));
    }
  }

  public resetSession() {
    try {
      sessionStorage.removeItem('nexxus_session_id');
    } catch {}
    this.sessionId = null;
    this.isInitialized = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public init() {
    if (typeof window === 'undefined') return;
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Reuse existing session ID from sessionStorage across refreshes in the same tab
    let existingId: string | null = null;
    try {
      existingId = sessionStorage.getItem('nexxus_session_id');
    } catch {}

    if (!existingId) {
      const randomPart = Math.random().toString(36).substring(2, 10);
      existingId = `session_${Date.now()}_${randomPart}`;
      try {
        sessionStorage.setItem('nexxus_session_id', existingId);
      } catch {}
    }

    this.sessionId = existingId;

    const info = detectClientDevice();

    const payload = JSON.stringify({
      id: this.sessionId,
      deviceName: info.deviceName,
      os: info.os,
      browser: info.browser,
      screen: info.screen,
      language: info.language,
      currentGame: this.currentGame,
    });

    // Notify backend on page load
    fetch('/api/telemetry/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }).catch(() => {});

    // Heartbeat every 2.5 seconds to ensure fast kick responsiveness
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = window.setInterval(async () => {
      if (!this.sessionId) return;
      try {
        const res = await fetch('/api/telemetry/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.sessionId,
            currentGame: this.currentGame,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.kicked) {
            this.triggerKick();
          }
        }
      } catch {}
    }, 2500);

    // Send close on beforeunload / pagehide
    const sendClose = () => {
      if (!this.sessionId) return;
      const closePayload = JSON.stringify({ id: this.sessionId });

      if (navigator.sendBeacon) {
        const blob = new Blob([closePayload], { type: 'application/json' });
        navigator.sendBeacon('/api/telemetry/close', blob);
      } else {
        fetch('/api/telemetry/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: closePayload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', sendClose);
    window.addEventListener('pagehide', sendClose);
  }

  public async updateGame(gameTitle: string | null) {
    this.currentGame = gameTitle ? `Playing ${gameTitle}` : 'Browsing Library';
    if (!this.sessionId) return;

    try {
      const res = await fetch('/api/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.sessionId,
          currentGame: this.currentGame,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.kicked) {
          this.triggerKick();
        }
      }
    } catch {}
  }
}

export const telemetry = new TelemetryClient();
