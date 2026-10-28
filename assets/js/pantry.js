/**
 * Modulo de Gestao da Despensa
 */

document.addEventListener('DOMContentLoaded', () => {
  initPantry();
});

function initPantry() {
  const form = document.getElementById('form-add-item');
  if (form) {
    form.addEventListener('submit', handleAddItem);
  }
  renderPantryList();
}

// Processa o cadastro de um novo ingrediente
function handleAddItem(event) {
  event.preventDefault(); // Impede o navegador de recarregar a pagina!

  // Coleta os valores digitados no formulario
  const name = document.getElementById('item-name').value.trim();
  const quantity = parseFloat(document.getElementById('item-quantity').value);
  const unit = document.getElementById('item-unit').value;
  const expirationDate = document.getElementById('item-expiration').value;
  const estimatedPrice = parseFloat(document.getElementById('item-price').value);

  // Normaliza a quantidade para nossa unidade base (g, ml ou unid)
  const normalized = normalizeQuantity(quantity, unit);

  // Cria o objeto do novo item
  const newItem = {
    id: 'item_' + Date.now(), // Gera um ID unico baseado no relogio do sistema
    name,
    quantity,
    unit,
    baseQuantity: normalized.value,
    baseUnit: normalized.baseUnit,
    expirationDate,
    estimatedPrice
  };

  // Salva no localStorage
  const currentItems = getPantryItems();
  currentItems.push(newItem);
  savePantryItems(currentItems);

  // Limpa e esconde o formulario
  const form = document.getElementById('form-add-item');
  form.reset();
  form.classList.add('hidden');

  // Atualiza a tela e o contador do topo
  renderPantryList();
  updateHeaderSummary();
}

// Desenha a lista de alimentos cadastrados na tela
function renderPantryList() {
  const container = document.getElementById('pantry-list');
  const items = getPantryItems();

  if (!container) return;

  // Se nao houver itens cadastrados, mostra uma mensagem amigavel
  if (items.length === 0) {
    container.innerHTML = `
      <div class="card text-center">
        <p style="color: var(--text-muted);">Sua despensa está vazia.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Clique em <strong>+ Novo Item</strong> para começar!</p>
      </div>
    `;
    return;
  }

  // Ordena os itens: os que vencem primeiro ficam no topo
  items.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

  // Gera o HTML de cada item da lista
  container.innerHTML = items.map(item => {
    const status = getExpirationStatus(item.expirationDate);
    
    return `
      <div class="card item-card">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.quantity} ${item.unit} • R$ ${item.estimatedPrice.toFixed(2)}</p>
          <span class="badge-status ${status.class}">${status.text}</span>
        </div>
        <button class="btn-delete" onclick="deleteItem('${item.id}')" title="Excluir item">🗑️</button>
      </div>
    `;
  }).join('');
}

// Remove um item da despensa pelo ID
function deleteItem(id) {
  let items = getPantryItems();
  items = items.filter(item => item.id !== id);
  savePantryItems(items);
  
  renderPantryList();
  updateHeaderSummary();
}

// Calcula quantos dias faltam para a validade e define o alerta visual
function getExpirationStatus(expirationDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera hora/minuto para comparar apenas a data

  const expDate = new Date(expirationDateStr + 'T00:00:00');
  
  // Converte a diferenca de tempo em dias
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Venceu há ${Math.abs(diffDays)} dia(s)`, class: 'expired' };
  } else if (diffDays === 0) {
    return { text: 'Vence HOJE!', class: 'warning' };
  } else if (diffDays <= 3) {
    return { text: `Vence em ${diffDays} dia(s)`, class: 'warning' };
  } else {
    return { text: `Validade: ${expDate.toLocaleDateString('pt-BR')}`, class: 'good' };
  }
}