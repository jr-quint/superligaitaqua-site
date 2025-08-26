const CACHE_NAME = 'gerenciador-quadra-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/utilidades/gerenciador-quadra-v2/',
        '/utilidades/gerenciador-quadra-v2/index.html', // cache inicial, mas rede terá prioridade
        '/utilidades/gerenciador-quadra-v2/assets/css/bootstrap-icons.css',
        '/utilidades/gerenciador-quadra-v2/assets/css/bootstrap.min.css',
        '/utilidades/gerenciador-quadra-v2/assets/css/main.css',
        '/utilidades/gerenciador-quadra-v2/assets/icons/fonts/bootstrap-icons.woff',
        '/utilidades/gerenciador-quadra-v2/assets/icons/fonts/bootstrap-icons.woff2',
        '/utilidades/gerenciador-quadra-v2/assets/icons/img/favicon.png',
        '/utilidades/gerenciador-quadra-v2/assets/icons/img/icon-192x192.png',
        '/utilidades/gerenciador-quadra-v2/assets/icons/img/icon-512x512.png',
        '/utilidades/gerenciador-quadra-v2/assets/js/app.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/bootstrap.bundle.min.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/config.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/Database.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/fila.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/grupo.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/jogador.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/notificacao.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/quadra.js',
        '/utilidades/gerenciador-quadra-v2/assets/js/time.js',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estratégia: network first, fallback para cache
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Para HTML (como index.html) → rede primeiro
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Para assets → rede primeiro também, mas fallback cache
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
  }
});
