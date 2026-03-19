/* Centralized key names used in sessionStorage. */
const StateKeys = {
  sku: 'pp.sku',
  category: 'pp.category',
  previewData: 'pp.previewData',
  photoIndex: 'pp.photoIndex',
  capturedPhotos: 'pp.capturedPhotos',
  details: 'pp.details',
  aiResult: 'pp.aiResult',
  selectedVariant: 'pp.selectedVariant',
  pendingCount: 'pp.pendingCount'
};

/* Generates a predictable mock object used when screens are visited out of order. */
function buildFallbackAiResult() {
  const preview = getState(StateKeys.previewData, {});
  const category = preview.categoria || getState(StateKeys.category, 'Anillo');
  const isWatch = category === 'Reloj';
  const marca = preview.marca || 'Marca no especificada';
  const modelo = preview.modelo || 'Modelo no especificado';
  const kilataje = preview.kilataje || '14';
  const svg = function (label) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420">' +
      '<rect width="100%" height="100%" fill="#F1F1F1"/>' +
      '<text x="50%" y="48%" text-anchor="middle" font-size="22" fill="#737373">' + label + '</text>' +
      '<text x="50%" y="56%" text-anchor="middle" font-size="14" fill="#9A9A9A">Presta Prenda Demo</text>' +
      '</svg>'
    );
  };

  return {
    title: isWatch
      ? 'Reloj ' + marca + ' ' + modelo
      : category + ' de oro amarillo de ' + kilataje + ' kilates',
    description: isWatch
      ? 'Reloj con marca y modelo precargados desde sucursal. Este contenido es una referencia visual temporal para la demo del funnel.'
      : 'Pieza de joyería en condiciones visibles de uso con acabado brillante y silueta bien definida. Este contenido es una referencia visual temporal para la demo del funnel.',
    variants: [svg('Variante 1'), svg('Variante 2'), svg('Variante 3'), svg('Variante 4')]
  };
}

/* Safely reads JSON values from sessionStorage and falls back when missing. */
function getState(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

/* Persists values in sessionStorage as JSON for cross-screen continuity. */
function setState(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

/* Merges partial updates into an object state stored under a key. */
function mergeState(key, partial) {
  const current = getState(key, {});
  const next = Object.assign({}, current, partial);
  setState(key, next);
  return next;
}

/* Ensures base values exist so screens can render even without user input. */
function ensureDefaults() {
  if (!getState(StateKeys.sku, '')) {
    setState(StateKeys.sku, 'SKU-DEMO-001');
  }
  if (!getState(StateKeys.category, '')) {
    setState(StateKeys.category, 'Anillo');
  }
  if (!getState(StateKeys.previewData, null)) {
    setState(StateKeys.previewData, {
      sku: getState(StateKeys.sku, 'SKU-DEMO-001'),
      categoria: getState(StateKeys.category, 'Anillo'),
      kilataje: '14',
      peso: '6.8',
      precioLista: '$8,950',
      precioVenta: '$7,450',
      descuento: '16.8%'
    });
  }
  if (!Array.isArray(getState(StateKeys.capturedPhotos, null))) {
    setState(StateKeys.capturedPhotos, []);
  }
  if (typeof getState(StateKeys.photoIndex, null) !== 'number') {
    setState(StateKeys.photoIndex, 0);
  }
  if (!getState(StateKeys.details, null)) {
    setState(StateKeys.details, {
      genero: 'Unisex',
      tipoOro: [],
      measurement: ''
    });
  }
  if (typeof getState(StateKeys.pendingCount, null) !== 'number') {
    setState(StateKeys.pendingCount, 42);
  }
  if (!getState(StateKeys.aiResult, null)) {
    setState(StateKeys.aiResult, buildFallbackAiResult());
  }
  if (typeof getState(StateKeys.selectedVariant, null) !== 'number') {
    setState(StateKeys.selectedVariant, 0);
  }
}

/* Resets the moving pieces of the funnel while preserving the demo pending metric. */
function resetFunnelState() {
  setState(StateKeys.sku, 'SKU-DEMO-001');
  setState(StateKeys.category, 'Anillo');
  setState(StateKeys.previewData, {
    sku: 'SKU-DEMO-001',
    categoria: 'Anillo',
    kilataje: '14',
    peso: '6.8',
    precioLista: '$8,950',
    precioVenta: '$7,450',
    descuento: '16.8%'
  });
  setState(StateKeys.photoIndex, 0);
  setState(StateKeys.capturedPhotos, []);
  setState(StateKeys.details, {
    genero: 'Unisex',
    tipoOro: [],
    measurement: ''
  });
  setState(StateKeys.aiResult, buildFallbackAiResult());
  setState(StateKeys.selectedVariant, 0);
}

document.addEventListener('DOMContentLoaded', ensureDefaults);
