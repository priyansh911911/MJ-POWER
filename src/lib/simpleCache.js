// Simple in-memory cache with TTL

const __cache = new Map(); // key -> { data, expiry }

export function getCached(key) {
  const entry = __cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data;
  if (entry) __cache.delete(key);
  return null;
}

export function setCached(key, data, ttlMs) {
  const ttl = typeof ttlMs === "number" ? ttlMs : 5 * 60 * 1000; // default 5m
  __cache.set(key, { data, expiry: Date.now() + ttl });
}

export function makeKey(namespace, obj) {
  try {
    return `${namespace}:${JSON.stringify(obj)}`;
  } catch {
    return `${namespace}:${String(obj)}`;
  }
}

export function clearCached(key) {
  __cache.delete(key);
}

export function clearAllCache() {
  __cache.clear();
}
