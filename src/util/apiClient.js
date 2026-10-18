/**
 * Resilient Warframe Market API client with pre-fetched data support, fallback proxy chains,
 * and in-flight request deduplication.
 */

const cache = new Map();
const inFlightRequests = new Map();
let staticDataPromise = null;

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Data sources for pre-fetched market statistics:
 * 1. Dedicated 'data' branch via raw GitHub (CORS enabled by GitHub).
 * 2. jsDelivr CDN mirror for the 'data' branch.
 */
const DATA_BRANCH_SOURCES = [
  "https://raw.githubusercontent.com/Szitku/loid-arcane-packs-value/data/market-data.json",
  "https://cdn.jsdelivr.net/gh/Szitku/loid-arcane-packs-value@data/market-data.json",
];

export async function preloadMarketData() {
  if (staticDataPromise) return staticDataPromise;

  staticDataPromise = (async () => {
    for (const url of DATA_BRANCH_SOURCES) {
      try {
        const res = await fetchWithTimeout(url, {}, 5000);
        if (res.ok) {
          const json = await res.json();
          if (json?.arcanes && Object.keys(json.arcanes).length > 0) {
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

    console.warn(
      "Could not load pre-fetched market data from remote data branch, will use live fallback.",
    );
    return null;
  })();

  return staticDataPromise;
}

export async function fetchArcaneStatistics(arcaneId) {
  const cacheKey = `stats_${arcaneId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (inFlightRequests.has(arcaneId)) {
    return inFlightRequests.get(arcaneId);
  }

  const fetchPromise = (async () => {
    // 1. First, ensure pre-fetched static dataset is loaded
    await preloadMarketData();
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const endpointPath = `/v1/items/${arcaneId}/statistics`;
    const fullTarget = `https://api.warframe.market${endpointPath}`;

    // 2. Fallback to dev proxy if in local development
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
  })();

  inFlightRequests.set(arcaneId, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(arcaneId);
  }
}
