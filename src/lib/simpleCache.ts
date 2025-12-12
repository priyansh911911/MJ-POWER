// Simple in-memory cache with TTL

const __cache = new Map<string, { data: unknown; expiry: number }>();

export function getCached<T = unknown>(key: string): T | null {
  const entry = __cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data as T;
  if (entry) __cache.delete(key);
  return null;
}

export function setCached(key: string, data: unknown, ttlMs?: number): void {
  const ttl = typeof ttlMs === "number" ? ttlMs : 5 * 60 * 1000;
  __cache.set(key, { data, expiry: Date.now() + ttl });
}

export function makeKey(namespace: string, obj: unknown): string {
  try {
    return `${namespace}:${JSON.stringify(obj)}`;
  } catch {
    return `${namespace}:${String(obj)}`;
  }
}

export function clearCached(key: string): void {
  __cache.delete(key);
}

export function clearAllCache(): void {
  __cache.clear();
}
