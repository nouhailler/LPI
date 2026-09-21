# 13 — PWA Architecture & Offline-First Strategy

> This document details the Progressive Web App (PWA) implementation of **LPI Certification Prep**, its custom Service Worker, two-tier caching strategy, and seamless background updates without loss of learner state.

---

## 1. Principles & Fundamental Requirements

The application was architected from inception around an **Absolute Offline-First** paradigm:
- **Zero Network Requirement**: Once loaded or installed, all 2,000+ flashcards, exam questions, and the virtual terminal run completely offline (airplane mode, transit, remote zones).
- **No Critical Server Dependency**: No backend server is required to execute code or persist user achievements.
- **State Preservation Across Updates**: Application version updates are applied seamlessly without wiping or corrupting client `localStorage`.

---

## 2. Web App Manifest (`public/manifest.json`)

The Web App Manifest configures the application for native multi-platform installation across desktop (Windows, macOS, Linux) and mobile devices (iOS, Android):

```json
{
  "name": "LPI Certification Prep",
  "short_name": "LPI Prep",
  "description": "Comprehensive preparation platform for LPIC-1, LPIC-2, and LPIC-3 certifications.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff8f2",
  "theme_color": "#201b11",
  "orientation": "any",
  "icons": [
    {
      "src": "/app-logo.jpg",
      "sizes": "192x192",
      "type": "image/jpeg",
      "purpose": "any maskable"
    },
    {
      "src": "/app-logo.jpg",
      "sizes": "512x512",
      "type": "image/jpeg",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "productivity", "utilities"]
}
```

---

## 3. Two-Tier Service Worker Strategy

1. **Static Core Assets (Cache-First)**: HTML shell, compiled JavaScript chunks, CSS, typography, and application icons are served immediately from the local Service Worker cache.
2. **Dynamic Update Check (Stale-While-Revalidate / Polling)**: The application periodically polls `version.json` in the background without blocking the UI. When a newer release is detected, a non-intrusive update banner notifies the user to reload when ready.
