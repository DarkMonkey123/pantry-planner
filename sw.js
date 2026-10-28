const CACHE_NAME = 'pantry-planner-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/storage.js',
  './assets/js/app.js',
  './assets/js/pantry.js',
  './assets/data/recipes-data.js',
  './assets/js/recipes.js',
  './assets/js/shopping.js',
  './assets/js/pwa.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});