self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-app-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/main.chunk.js',
          '/static/js/0.chunk.js',
          '/static/js/bundle.js',
          '/static/css/main.chunk.css',
          '/favicon.ico',
          '/logo192.png', // Cache other assets and images
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  