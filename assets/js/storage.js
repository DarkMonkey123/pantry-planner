/**
 * Modulo de armazenamento seguro com localStorage e Conversao de Unidades
 */

const STORAGE_KEYS = {
  PANTRY: 'pantry_items_v1',
  METRICS: 'pantry_metrics_v1'
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