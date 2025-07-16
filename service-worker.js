const CACHE_NAME = 'neumorphic-alarm-clock-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icon-192x192.png', /* Make sure these paths are correct */
  '/images/icon-512x512.png', /* Make sure these paths are correct */
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com', /* Needed for the font to load */
  /* Add paths to your default sound files here */
  '/sounds/default_chime.mp3',
  '/sounds/default_bell.mp3',
  '/sounds/default_horn.mp3'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache addAll failed', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Optional: Handle push notifications (for future use if you implement them)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('Push received:', data);
  const title = data.title || 'Alarm Clock';
  const options = {
    body: data.body || 'Your alarm is ringing!',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png', // A smaller icon for notification tray
    vibrate: [200, 100, 200],
    data: {
      url: data.url || self.location.origin // URL to open when notification is clicked
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
