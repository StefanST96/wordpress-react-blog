const TTL = 5 * 60 * 1000;
const PREFIX = "posts_cache_";

const getKey = (filters = {}, page = 1) => {
  const category = filters.category ?? "all";
  const city = filters.city ?? "all";

  return `${PREFIX}c${category}_ct${city}_p${page}_v1`;
};

export const postCache = {
  get(filters = {}, page = 1) {
    try {
      const key = getKey(filters, page);
      const raw = sessionStorage.getItem(key);

      if (!raw) return null;

      const { posts, timestamp } = JSON.parse(raw);

      if (Date.now() - timestamp > TTL) {
        sessionStorage.removeItem(key);
        return null;
      }

      return posts;
    } catch {
      return null;
    }
  },

  set(posts, filters = {}, page = 1) {
    try {
      const key = getKey(filters, page);

      sessionStorage.setItem(
        key,
        JSON.stringify({
          posts: Array.isArray(posts) ? posts : [],
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      console.error("Cache set error:", err);

      // fallback ako storage pukne
      try {
        sessionStorage.clear();
      } catch {}
    }
  },

  clear() {
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {}
  },
};
