const TTL = 5 * 60 * 1000; // 5 minuta

const getKey = (catId) =>
  catId ? `posts_cache_cat_${catId}_v1` : "posts_cache_all_v1";

export const postCache = {
  get(catId = null) {
    const key = getKey(catId);
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { posts, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return posts;
  },

  set(posts, catId = null) {
    const key = getKey(catId);
    const safe = posts.slice(0, 80);
    sessionStorage.setItem(
      key,
      JSON.stringify({
        posts: safe,
        timestamp: Date.now(),
      }),
    );
  },

  clear(catId = null) {
    sessionStorage.removeItem(getKey(catId));
  },
};
