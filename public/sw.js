// Minimal service worker — exists only to satisfy browsers' PWA installability
// checks (an "Install app" prompt instead of a plain bookmark). It doesn't cache
// anything, so every request still goes straight to the network as normal.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})
