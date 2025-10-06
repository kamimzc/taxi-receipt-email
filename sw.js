self.addEventListener('install', function(event) {
  console.log('Service Worker instalado.');
});

self.addEventListener('fetch', function(event) {
  // Você pode colocar cache aqui, mas não é obrigatório
});
