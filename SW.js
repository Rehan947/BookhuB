const CACHE_NAME = "bookhub-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",

  "./manifest.json",

  "./Meet-the-Maker.html",
  "./feedback.html",
  "./know.html",
  "./cgpa.html",

  "./cgpa.css",
  "./cgpa.js",
  "./script_about.js",

  "./favicon_BB.jpeg",

  "./icons/BB192x192.png",
  "./icons/BB512x512.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});