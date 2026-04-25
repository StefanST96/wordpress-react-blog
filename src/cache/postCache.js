const CACHE_KEY = "posts_cache_v1";

export const postCache = {
  get() {
    const data = sessionStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  },

  set(posts) {
    const safe = posts.slice(0, 80);
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(safe));
  },

  clear() {
    sessionStorage.removeItem(CACHE_KEY);
  },
};
