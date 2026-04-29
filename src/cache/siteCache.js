const SITE_CACHE_KEY = "site_settings_v1";

export const siteCache = {
  get() {
    const raw = sessionStorage.getItem(SITE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  set(data) {
    sessionStorage.setItem(SITE_CACHE_KEY, JSON.stringify(data));
  },
};
