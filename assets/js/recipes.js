/**
 * Modulo de Receitas e Algoritmo de Ranking
 */

let allRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
  loadRecipes();
  initRecipeFilters();
});

// Carrega as receitas diretamente da nossa variavel sem precisar do fetch
function loadRecipes() {
  if (typeof DEFAULT_RECIPES !== 'undefined') {
    const customRecipes = getCustomRecipes(); // Le as receitas proprias
    
    // O operador '...' (spread) junta os dois arrays em uma lista unica
    allRecipes = [...DEFAULT_RECIPES, ...customRecipes]; 
    
    renderRankedRecipes();
  } else {
    console.error('Arquivo recipes-data.js nao foi carregado.');
  }
}

// Configura o filtro de tempo rápido
function initRecipeFilters() {
  const filterQuick = document.getElementById('filter-quick');
  if (filterQuick) {
    filterQuick.addEventListener('change', renderRankedRecipes);
  }
}

function getAllRecipes() {
  const customRecipes = JSON.parse(localStorage.getItem('custom_recipes_v1')) || [];
  return [...DEFAULT_RECIPES, ...customRecipes]; // União dos dois arrays
}

// Algoritmo Principal de Ranking
function renderRankedRecipes() {
  const container = document.getElementById('recipes-list');
  if (!container || allRecipes.length === 0) return;

  const pantryItems = getPantryItems();
  const filterQuickOnly = document.getElementById('filter-quick')?.checked;

  // Filtra receitas rápidas se o checkbox estiver ativo
  let recipesToRank = allRecipes;
  if (filterQuickOnly) {
    recipesToRank = recipesToRank.filter(r => r.prepTimeMinutes <= 20);
  }

  // Calcula o Score de cada receita
  const ranked = recipesToRank.map(recipe => {
    let matchCount = 0;
    let urgentItemsCount = 0;
    const missingIngredients = [];

    recipe.ingredients.forEach(reqIng => {
      // Se for ingrediente básico (sal, água...), consideramos disponível
      if (reqIng.isBasic) {
        matchCount++;
        return;
      }

      // Procura o ingrediente na despensa do usuário
      const pantryItem = pantryItems.find(p => 
        p.name.toLowerCase().trim() === reqIng.name.toLowerCase().trim()
      );

      if (pantryItem && pantryItem.baseQuantity > 0) {
        matchCount++;
        
        // Checa se o item usado está perto de vencer (3 dias ou menos)
        const daysToExp = getDaysToExpiration(pantryItem.expirationDate);
        if (daysToExp <= 3) {
          urgentItemsCount++;
        }
      } else {
        missingIngredients.push(reqIng);
      }
    });

    const totalIngredients = recipe.ingredients.length;
    const matchPercentage = Math.round((matchCount / totalIngredients) * 100);

    // Calculo dos pontos (0 a 100)
    let score = (matchCount / totalIngredients) * 60; // Ate 60 pts por cobertura
    score += Math.min(urgentItemsCount * 15, 30);      // Ate 30 pts por itens urgentes
    if (recipe.prepTimeMinutes <= 20) score += 10;     // 10 pts se for rapido

    return {
      recipe,
      score,
      matchPercentage,
      missingIngredients,
      hasUrgentItem: urgentItemsCount > 0
    };
  });

  // Ordena do maior Score para o menor
  ranked.sort((a, b) => b.score - a.score);

  // Renderiza os cartões de receita na tela
  container.innerHTML = ranked.map(item => {
    const r = item.recipe;
    const missingText = item.missingIngredients.length === 0 
      ? '✅ Você tem todos os ingredientes!' 
      : `⚠️ Faltam ${item.missingIngredients.length} ingrediente(s)`;

    return `
      <div class="card recipe-card">
        <div class="recipe-header">
          <h3>${r.title}</h3>
          ${item.hasUrgentItem ? '<span class="badge-urgent">🔥 Usa item prestes a vencer!</span>' : ''}
        </div>
        
        <p class="recipe-meta">⏱️ ${r.prepTimeMinutes} min • 🍽️ ${r.servings} porções</p>
        
        <div class="match-bar-container">
          <div class="match-bar" style="width: ${item.matchPercentage}%;"></div>
        </div>
        <p class="match-text">${item.matchPercentage}% dos ingredientes disponíveis • ${missingText}</p>

        <details class="recipe-details">
          <summary class="btn btn-secondary">Ver Receita & Modo de Preparo</summary>
          
          <h4 style="margin-top: 12px;">Ingredientes:</h4>
          <ul>
            ${r.ingredients.map(ing => `<li>${ing.quantity} ${ing.unit} de ${ing.name} ${ing.isBasic ? '<i>(Básico)</i>' : ''}</li>`).join('')}
          </ul>

          <h4 style="margin-top: 12px;">Modo de Preparo:</h4>
          <ol>
            ${r.instructions.map(step => `<li>${step}</li>`).join('')}
          </ol>
          <button class="btn btn-success" style="margin-top: 16px;" onclick="cookRecipe('${r.id}')">
            🍳 Cozinhar esta Receita (Baixar Estoque)
          </button>
        </details>
      </div>
    `;
  }).join('');
}

// Função utilitária de auxílio para calcular dias até a validade
function getDaysToExpiration(expirationDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDateStr + 'T00:00:00');
  return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
}

// Funçao para cadastrar uma nova receita vinda do formulario
function handleAddCustomRecipe(event) {
  event.preventDefault();

  const title = document.getElementById('recipe-title').value.trim();
  const prepTimeMinutes = parseInt(document.getElementById('recipe-time').value);
  const servings = parseInt(document.getElementById('recipe-servings').value);
  
  // Pegamos os ingredientes digitados (ex: "Tomate: 2 unid, Ovo: 3 unid")
  const rawIngredients = document.getElementById('recipe-ingredients').value;
  const ingredients = parseIngredientsInput(rawIngredients);

  const instructionsText = document.getElementById('recipe-instructions').value;
  const instructions = instructionsText.split('\n').filter(step => step.trim() !== '');

  const newRecipe = {
    id: 'custom_' + Date.now(), // Gera um ID único
    title,
    prepTimeMinutes,
    servings,
    ingredients,
    instructions
  };

  // Salva no localStorage
  const currentCustom = getCustomRecipes();
  currentCustom.push(newRecipe);
  saveCustomRecipes(currentCustom);

  // Recarrega a lista completa de receitas na tela
  loadRecipes();
}