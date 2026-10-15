/**
 * Resilient Warframe Market API client with pre-fetched data support and fallback proxy chains.
 */

const cache = new Map();
let staticDataPromise = null;
let marketMetadata = {
  lastUpdated: null,
  itemCount: 0,
};

export function getMarketDataMetadata() {
  return marketMetadata;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Data sources for pre-fetched market statistics.
 * 1. Dedicated 'data' branch via raw GitHub (CORS enabled by GitHub).
 * 2. jsDelivr CDN mirror for the 'data' branch.
 * 3. Local bundled copy in dist/ (fallback for offline or before first data branch push).
 */
const DATA_BRANCH_SOURCES = [
  "https://raw.githubusercontent.com/Szitku/loid-arcane-packs-value/data/market-data.json",
  "https://cdn.jsdelivr.net/gh/Szitku/loid-arcane-packs-value@data/market-data.json",
];

export async function preloadMarketData() {
  if (staticDataPromise) return staticDataPromise;

  staticDataPromise = (async () => {
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const localUrl = `${cleanBase}data/market-data.json`;

    const candidateUrls = [...DATA_BRANCH_SOURCES, localUrl];

    for (const url of candidateUrls) {
      try {
        const res = await fetchWithTimeout(url, {}, 5000);
        if (res.ok) {
          const json = await res.json();
          if (json?.arcanes && Object.keys(json.arcanes).length > 0) {
            marketMetadata = {
              lastUpdated: json.lastUpdated || null,
              itemCount: json.itemCount || Object.keys(json.arcanes).length,
            };
            for (const [id, data] of Object.entries(json.arcanes)) {
              cache.set(`stats_${id}`, data);
            }
            return json;
          }
        }
      } catch {
        // Try next candidate source
      }
    }

    console.warn("Could not load pre-fetched market data from any source, will use live fallback.");
    return null;
  })();

  return staticDataPromise;
}

export async function fetchArcaneOrders(arcane, rank = arcane.maxRank) {
  const cacheKey = `orders_${arcane.id}_${rank}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const endpointPath = `/v2/orders/item/${arcane.id}/top?rank=${rank}`;
  const fullTarget = `https://api.warframe.market${endpointPath}`;

  // Strategy 1: In local development, use Vite proxy
  if (import.meta.env.DEV) {
    try {
      const res = await fetchWithTimeout(`/api/wf${endpointPath}`, {}, 5000);
      if (res.ok) {
        const data = await res.json();
        cache.set(cacheKey, data);
        return data;
      }
    } catch {
      // Fall through to public proxy if dev proxy fails
    }
  }

  // Strategy 2: Use CORS proxies
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(fullTarget)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(fullTarget)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetchWithTimeout(proxyUrl, {}, 6000);
      if (res.ok) {
        const data = await res.json();
        cache.set(cacheKey, data);
        return data;
      }
    } catch {
      // Try next
    }
  }

  // Strategy 3: Direct fetch fallback
  try {
    const res = await fetchWithTimeout(fullTarget, {}, 5000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Fail
  }

  throw new Error(`Unable to fetch orders for ${arcane.id} at rank ${rank}`);
}

export async function fetchArcaneStatistics(arcaneId) {
  const cacheKey = `stats_${arcaneId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // 1. First, ensure pre-fetched static dataset is loaded
  await preloadMarketData();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // 2. Fallback to dev proxy if in local development
  const endpointPath = `/v1/items/${arcaneId}/statistics`;
  const fullTarget = `https://api.warframe.market${endpointPath}`;

  if (import.meta.env.DEV) {
    try {
      const res = await fetchWithTimeout(`/api/wf${endpointPath}`, {}, 5000);
      if (res.ok) {
        const data = await res.json();
        cache.set(cacheKey, data);
        return data;
      }
    } catch {
      // Fall through
    }
  }

  // 3. Fallback to public CORS proxies
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(fullTarget)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(fullTarget)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetchWithTimeout(proxyUrl, {}, 6000);
      if (res.ok) {
        const data = await res.json();
        cache.set(cacheKey, data);
        return data;
      }
    } catch {
      // Try next proxy
    }
  }

  // 4. Direct fetch
  try {
    const res = await fetchWithTimeout(fullTarget, {}, 5000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Fail
  }

  throw new Error(`Unable to fetch sales statistics for ${arcaneId}`);
}
