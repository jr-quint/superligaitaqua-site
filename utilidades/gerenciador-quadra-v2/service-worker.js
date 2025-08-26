self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('gerenciador-quadra-v2').then((cache) => {
      return cache.addAll([
        '/utilidades/gerenciador-quadra-v2/',
        '/utilidades/gerenciador-quadra-v2/index.html',
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se encontrado no cache, retorna
      if (cachedResponse) {
        return cachedResponse;
      }
      // Caso contrário, faz a requisição normalmente
      return fetch(event.request);
    })
  );
});
