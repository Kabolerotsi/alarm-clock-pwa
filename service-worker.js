const CACHE_NAME = 'alarm-clock-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // If you extract your <style> block to a separate CSS file, add it here:
  // '/style.css', 
  // If you extract your <script> block to a separate JS file, add it here:
  // '/script.js', 
  '/sounds/default_chime.mp3',
  '/sounds/default_bell.mp3',
  '/sounds/default_horn.mp3',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com' // Important for fonts to load offline
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).catch(() => {
            // If network also fails, return a fallback for navigation requests
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html'); // Fallback to your main page
            }
        });
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});