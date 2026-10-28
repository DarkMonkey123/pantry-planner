if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('PWA Offline ativo com sucesso!'))
      .catch((err) => console.error('Erro ao registrar PWA:', err));
  });
}