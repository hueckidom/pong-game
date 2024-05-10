self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.css',
        '/index.js',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
        '/manifest.json',
        '/vite.svg',
        '/assets/button-click-sound.mp3',
        '/assets/correct.mp3',
        '/assets/game.mp3',
        '/assets/goal.mp3',
        '/assets/Paddle Ball Hit Sound Effect HD.mp3',
        '/assets/questions.mp3',
        '/assets/wrong.mp3',
        '/assets/correct.mp3',
        '/assets/valuehero.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
