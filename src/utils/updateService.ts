/**
 * Update and Version Management Service for LPI Certification Prep.
 */

export interface VersionInfo {
  version: string;
  releaseDate: string;
  buildTime: string;
  changelog: string[];
}

export const CURRENT_APP_VERSION = '2.4.0';
export const CURRENT_RELEASE_DATE = 'September 1, 2026';
export const CURRENT_BUILD_TAG = 'prod-20260901-lpic-full';

export interface UpdateSettings {
  autoUpdateEnabled: boolean;
  checkIntervalMinutes: number;
  lastCheckedTime: string | null;
  notifyOnUpdate: boolean;
}

const SETTINGS_KEY = 'lpi_prep_update_settings';

const DEFAULT_SETTINGS: UpdateSettings = {
  autoUpdateEnabled: true,
  checkIntervalMinutes: 15,
  lastCheckedTime: null,
  notifyOnUpdate: true,
};

export function getUpdateSettings(): UpdateSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUpdateSettings(settings: Partial<UpdateSettings>): UpdateSettings {
  const current = getUpdateSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save update settings:', e);
  }
  return updated;
}

type UpdateCallback = (available: boolean, latestInfo?: VersionInfo) => void;
const listeners = new Set<UpdateCallback>();

export function subscribeToUpdateEvents(cb: UpdateCallback): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notifyListeners(available: boolean, latestInfo?: VersionInfo) {
  listeners.forEach((cb) => {
    try {
      cb(available, latestInfo);
    } catch (e) {
      console.error('Error in update listener:', e);
    }
  });
}

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register Service Worker for PWA and automatic update detection.
 */
export async function initServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;

    // Check if a new service worker is already waiting
    if (reg.waiting) {
      notifyListeners(true);
    }

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          notifyListeners(true);
        }
      });
    });

    // Check periodically if enabled
    startUpdatePolling();

    // Check on window focus / visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const settings = getUpdateSettings();
        if (settings.autoUpdateEnabled) {
          checkForUpdates(false);
        }
      }
    });
  } catch (err) {
    console.warn('Service Worker registration skipped or failed in sandboxed preview:', err);
  }
}

let pollingInterval: number | null = null;

export function startUpdatePolling(): void {
  if (pollingInterval) {
    window.clearInterval(pollingInterval);
  }

  const settings = getUpdateSettings();
  if (!settings.autoUpdateEnabled) return;

  const ms = Math.max(1, settings.checkIntervalMinutes) * 60 * 1000;
  pollingInterval = window.setInterval(() => {
    checkForUpdates(false);
  }, ms);
}

/**
 * Checks for updates from the server.
 */
export async function checkForUpdates(manual = true): Promise<{
  hasUpdate: boolean;
  latestVersion?: string;
  latestInfo?: VersionInfo;
  error?: string;
}> {
  saveUpdateSettings({ lastCheckedTime: new Date().toISOString() });

  // 1. Tell service worker to check for updates
  if (swRegistration) {
    try {
      await swRegistration.update();
    } catch (e) {
      console.warn('SW update check warning:', e);
    }
  }

  // 2. Query version.json with timestamp to avoid HTTP cache
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      // Fallback
      return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION };
    }

    const info: VersionInfo = await response.json();
    const isNewer = isVersionGreater(info.version, CURRENT_APP_VERSION);

    if (isNewer) {
      notifyListeners(true, info);
      return {
        hasUpdate: true,
        latestVersion: info.version,
        latestInfo: info,
      };
    }

    return {
      hasUpdate: false,
      latestVersion: CURRENT_APP_VERSION,
      latestInfo: info,
    };
  } catch (err: any) {
    if (manual) {
      console.warn('Version check network warning:', err);
    }
    return {
      hasUpdate: false,
      latestVersion: CURRENT_APP_VERSION,
      error: err?.message || 'Network check failed',
    };
  }
}

/**
 * Force update the application:
 * Purges all CacheStorage caches, unregisters service workers,
 * and forces a hard reload.
 */
export async function forceApplicationUpdate(): Promise<void> {
  try {
    // 1. Tell waiting service worker to skip waiting
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // 2. Clear all cache storage keys
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    // 3. Unregister all service workers to ensure fresh fetch
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }

    // 4. Update last checked time
    saveUpdateSettings({ lastCheckedTime: new Date().toISOString() });
  } catch (e) {
    console.error('Error while forcing update:', e);
  } finally {
    // 5. Hard reload with cache busting query param
    const url = new URL(window.location.href);
    url.searchParams.set('_v_reload', Date.now().toString());
    window.location.href = url.toString();
  }
}

/**
 * Helper to compare semantic versions (e.g. "2.4.1" vs "2.4.0")
 */
function isVersionGreater(v1: string, v2: string): boolean {
  const clean1 = v1.replace(/^v/, '').split('.').map(Number);
  const clean2 = v2.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < Math.max(clean1.length, clean2.length); i++) {
    const num1 = clean1[i] || 0;
    const num2 = clean2[i] || 0;
    if (num1 > num2) return true;
    if (num1 < num2) return false;
  }
  return false;
}
