import { useEffect, useState } from "react";
import { getSiteSettings } from "../api/site";

const CACHE_KEY = "site_settings_v1";

const getCache = () => {
  const raw = sessionStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
};

const setCache = (data) => {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export function useSiteSettings() {
  const cached = getCache();

  const [site, setSite] = useState(
    cached || {
      name: "",
      logo: "",
    },
  );

  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let isMounted = true;

    const fetchSite = async () => {
      try {
        const data = await getSiteSettings();

        const formatted = {
          name: data?.name || "",
          logo: data?.site_icon_url || "",
        };

        if (isMounted) {
          setSite(formatted);
          setLoading(false);
        }

        setCache(formatted);
      } catch (err) {
        console.error("useSiteSettings error:", err);
        setLoading(false);
      }
    };

    fetchSite();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    name: site.name,
    logo: site.logo,
    loading,
  };
}
