self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('gerenciador-quadra-v1').then((cache) => {
      return cache.addAll([
        '/utilidades/gerenciador-quadra/', // Página inicial
        '/utilidades/gerenciador-quadra/index.html',
        '/utilidades/gerenciador-quadra/assets/css/style.css',
        '/utilidades/gerenciador-quadra/assets/css/bootstrap.css',
        '/utilidades/gerenciador-quadra/assets/js/bootstrap.bundle.js',
        '/utilidades/gerenciador-quadra/assets/js/script.js',
        '/utilidades/gerenciador-quadra/assets//icons/icon-192x192.png',  // Ícones
        '/utilidades/gerenciador-quadra/assets/icons/icon-512x512.png'
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