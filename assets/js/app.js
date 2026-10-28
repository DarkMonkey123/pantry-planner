/**
 * Controlador Principal do App e Navegacao
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormToggles();
  updateHeaderSummary();
});

function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Tira o destaque de todos os botoes e destaca o clicado
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Esconde todas as abas e mostra apenas a selecionada
      tabContents.forEach(tab => {
        if (tab.id === targetTab) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  });
}

function initFormToggles() {
  const btnOpen = document.getElementById('btn-open-add-item');
  const btnCancel = document.getElementById('btn-cancel-add-item');
  const formCard = document.getElementById('form-add-item');

  btnOpen.addEventListener('click', () => {
    formCard.classList.remove('hidden');
    document.getElementById('item-name').focus();
  });

  btnCancel.addEventListener('click', () => {
    formCard.classList.add('hidden');
    formCard.reset();
  });
}

function updateHeaderSummary() {
  const items = getPantryItems();
  const badge = document.getElementById('pantry-summary-badge');
  if (badge) {
    badge.textContent = `${items.length} ${items.length === 1 ? 'item' : 'itens'}`;
  }
}