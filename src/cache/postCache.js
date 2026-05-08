const TTL = 5 * 60 * 1000;
const PREFIX = "posts_cache_";

const getKey = (filters = {}, page = 1) => {
  const category = filters.category ?? "all";
  const city = filters.city ?? "all";
  const search = filters.search ?? "all";

  return `${PREFIX}c${category}_ct${city}_s${search}_p${page}_v1`;
};

export const postCache = {
  get(filters = {}, page = 1) {
    try {
      const raw = localStorage.getItem(getKey(filters, page));

      if (!raw) return null;

      const parsed = JSON.parse(raw);

      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(getKey(filters, page));
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  },

  set(data, filters = {}, page = 1) {
    try {
      localStorage.setItem(
        getKey(filters, page),
        JSON.stringify({
          data,
          expiry: Date.now() + TTL,
        }),
      );
    } catch (e) {
      console.warn("Cache set error:", e);
    }
  },

  clear() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
};
