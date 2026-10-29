/**
 * Modulo de armazenamento seguro com localStorage e Conversao de Unidades
 */

const STORAGE_KEYS = {
  PANTRY: 'pantry_items_v1',
  METRICS: 'pantry_metrics_v1',
  CUSTOM_RECIPES: 'custom_recipes_v1',
  WEEKLY_PLAN: 'weakly_plan_v1'
};

// --- Funcoes do LocalStorage ---

function getPantryItems() {
  const data = localStorage.getItem(STORAGE_KEYS.PANTRY);
  return data ? JSON.parse(data) : [];
}

function savePantryItems(items) {
  localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(items));
}

function getMetrics() {
  const data = localStorage.getItem(STORAGE_KEYS.METRICS);
  return data ? JSON.parse(data) : { totalSavedReais: 0, mealsPrepared: 0 };
}

function saveMetrics(metrics) {
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
}

// --- Normalizacao de Unidades ---
/**
 * Transforma qualquer quantidade para a unidade base minima:
 * 1 kg vira 1000g | 1 L vira 1000ml
 */
function normalizeQuantity(quantity, unit) {
  const q = parseFloat(quantity);
  switch (unit.toLowerCase()) {
    case 'kg':
      return { value: q * 1000, baseUnit: 'g' };
    case 'g':
      return { value: q, baseUnit: 'g' };
    case 'l':
      return { value: q * 1000, baseUnit: 'ml' };
    case 'ml':
      return { value: q, baseUnit: 'ml' };
    default:
      return { value: q, baseUnit: 'unid' };
  }
}

// Busca as receitas proprias cadastradas pelo usuario
function getCustomRecipes() {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
  return data ? JOSN.parse(data) : []; // Se nao existir nada ainda, devolve uma lista vazia []
}

// Salva uma nova receita propria no localStorage
function saveCustomRecipes(recipes) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(recipes));
}

// Retorna a estrutura dos 7 dias da semana
function getWeeklyPlan() {
  const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
  
  // Estrutura padrao inicial se a lousa estiver vazia
  const defaultPlan = {
    segunda: { lunch: null, dinner: null },
    terca:   { lunch: null, dinner: null },
    quarta:  { lunch: null, dinner: null },
    quinta:  { lunch: null, dinner: null },
    sexta:   { lunch: null, dinner: null },
    sabado:  { lunch: null, dinner: null },
    domingo: { lunch: null, dinner: null }
  };

  return data ? JSON.parse(data) : defaultPlan;
}

// Salva as alteracoes feitas na semana
function saveWeeklyPlan(plan) {
  localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(plan));
}