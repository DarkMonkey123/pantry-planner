/**
 * Controlador Principal do App e Navegacao
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormToggles();
  updateHeaderSummary();
  initBackupSystem();
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

function initBackupSystem(){
  const btnExport = document.getElementById('btn-export-json');
  const inputImport = document.getElementById('import-file');

  if (btnExport){
    btnExport.addEventListener('click', exportBackup);
  }

  if (inputImport){
    inputImport.addEventListener('change', importBackup);
  }
}

// 1. Exporta os dados salvos para um arquivo .json
function exportBackup(){
  const backupData = {
    pantry: getPantryItems(),
    metrics: getMetrics(),
    exportedAt: new Date().toISOString()
  };

  // Converte o objeto em texto JSON
  const jsonString = JSON.stringify(backupData, null, 2);

  // Cria um link temporario invisivel para disparar o download no navegador
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_despensa_${new Date().toISOString().slice(0,10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

//2. Le o arquivo .json enviado e restaura no localStorage
function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (importedData.pantry && importedData.metrics) {
        // Salva os dados importados no localStorage
        savePantryItems(importedData.pantry);
        saveMetrics(importedData.metrics);

        alert('🎉 Backup restaurado com sucesso!');

        // Atualiza todas as telas do app
        if (typeof renderPantryList === 'function') renderPantryList();
        if (typeof renderRankedRecipes === 'function') renderRankedRecipes();
        if (typeof renderShoppingList === 'function') renderShoppingList();
        if (typeof renderMetrics === 'function') renderMetrics();
        updateHeaderSummary();
      } else {
        alert('⚠️ Arquivo de backup inválido.');
      }
    } catch (err) {
      alert('❌ Erro ao ler o arquivo JSON.');
      console.error(err);
    }
  };

  reader.readAsText(file);
}

