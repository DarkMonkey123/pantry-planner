/**
 * Modulo de Lista de Compras e Acao de Cozinhar
 */

document.addEventListener('DOMContentLoaded', () => {
  renderShoppingList();
  renderMetrics();
});

// Gera a Lista de Compras agrupando os ingredientes que faltam nas receitas
function renderShoppingList() {
  const container = document.getElementById('shopping-list');
  if (!container) return;

  const pantryItems = getPantryItems();
  const missingMap = {};

  // Mapeia o que falta em todas as receitas
  allRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ing => {
      if (ing.isBasic) return; // Ignores ingredientes basicos (sal, agua, oleo)

      const pantryItem = pantryItems.find(p => 
        p.name.toLowerCase().trim() === ing.name.toLowerCase().trim()
      );

      // Se nao tem na despensa, adiciona na lista de compras
      if (!pantryItem || pantryItem.baseQuantity <= 0) {
        if (!missingMap[ing.name]) {
          missingMap[ing.name] = {
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            recipes: [recipe.title]
          };
        } else {
          // Se o ingrediente ja esta na lista, junta o nome da receita
          missingMap[ing.name].recipes.push(recipe.title);
        }
      }
    });
  });

  const missingItems = Object.values(missingMap);

  if (missingItems.length === 0) {
    container.innerHTML = `
      <div class="card text-center">
        <p style="color: var(--primary-color); font-weight: bold;">🎉 Sua despensa está completa!</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
          Você tem ingredientes para fazer as receitas disponíveis.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = missingItems.map(item => `
    <div class="card shopping-item-card">
      <div class="shopping-item-info">
        <h4>🛒 ${item.name}</h4>
        <p>Sugerido para: <i>${item.recipes.join(', ')}</i></p>
      </div>
    </div>
  `).join('');
}

// Funcao chamada ao clicar no botao "Concluir / Cozinhar Receita"
function cookRecipe(recipeId) {
  const recipe = allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;

  let pantryItems = getPantryItems();
  let metrics = getMetrics();
  let savedInThisMeal = 0;

  // Desconta cada ingrediente da receita da despensa
  recipe.ingredients.forEach(reqIng => {
    if (reqIng.isBasic) return;

    const pantryIndex = pantryItems.findIndex(p => 
      p.name.toLowerCase().trim() === reqIng.name.toLowerCase().trim()
    );

    if (pantryIndex !== -1) {
      const item = pantryItems[pantryIndex];
      
      // Soma o valor pago no contador de economia
      savedInThisMeal += item.estimatedPrice || 0;

      // Desconta a quantidade
      const normalizedReq = normalizeQuantity(reqIng.quantity, reqIng.unit);
      item.baseQuantity -= normalizedReq.value;
      item.quantity = Math.max(0, item.quantity - reqIng.quantity);

      // Se o estoque zerar ou ficar negativo, remove da despensa
      if (item.baseQuantity <= 0) {
        pantryItems.splice(pantryIndex, 1);
      }
    }
  });

  // Atualiza as metricas globais de economia
  metrics.totalSavedReais += savedInThisMeal;
  metrics.mealsPrepared += 1;

  // Salva tudo no localStorage
  savePantryItems(pantryItems);
  saveMetrics(metrics);

  // Mensagem de sucesso
  alert(`🍳 Bom apetite! Você preparou "${recipe.title}" e salvou R$ ${savedInThisMeal.toFixed(2)} em alimentos!`);

  // Atualiza todas as telas do aplicativo
  renderPantryList();
  renderRankedRecipes();
  renderShoppingList();
  renderMetrics();
  updateHeaderSummary();
}

// Atualiza a tela de Economia & Metricas (Aba 4)
function renderMetrics() {
  const metrics = getMetrics();
  const savedValEl = document.getElementById('total-saved-value');
  const mealsCountEl = document.getElementById('total-meals-count');

  if (savedValEl) savedValEl.textContent = `R$ ${metrics.totalSavedReais.toFixed(2)}`;
  if (mealsCountEl) mealsCountEl.textContent = metrics.mealsPrepared;
}