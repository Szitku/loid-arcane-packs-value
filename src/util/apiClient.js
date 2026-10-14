/**
 * Resilient Warframe Market API client with caching and fallback proxy support.
 */

const cache = new Map();

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

export async function fetchArcaneOrders(arcane) {
  const cacheKey = `orders_${arcane.id}_${arcane.maxRank}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const endpointPath = `/v2/orders/item/${arcane.id}/top?rank=${arcane.maxRank}`;
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

  // Strategy 2: Use allorigins CORS proxy
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fullTarget)}`;
    const res = await fetchWithTimeout(proxyUrl, {}, 8000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Try next strategy
  }

  // Strategy 3: Direct fetch (in case user has CORS extension or direct access)
  try {
    const res = await fetchWithTimeout(fullTarget, {}, 5000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Return empty placeholder structure so UI doesn't crash
  }

  return { data: { sell: [] } };
}

export async function fetchArcaneStatistics(arcaneId) {
  const cacheKey = `stats_${arcaneId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

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

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fullTarget)}`;
    const res = await fetchWithTimeout(proxyUrl, {}, 8000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Try direct
  }

  try {
    const res = await fetchWithTimeout(fullTarget, {}, 5000);
    if (res.ok) {
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
  } catch {
    // Fallback
  }

  return { payload: { statistics_closed: { "48hours": [] } } };
}
