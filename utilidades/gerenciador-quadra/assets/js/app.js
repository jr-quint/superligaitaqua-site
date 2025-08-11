if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/utilidades/gerenciador-quadra/assets/js/service-worker.js').then((registration) => {
      console.log('Service Worker registrado com sucesso:', registration);
    }).catch((error) => {
      console.log('Erro ao registrar o Service Worker:', error);
    });
  });
}