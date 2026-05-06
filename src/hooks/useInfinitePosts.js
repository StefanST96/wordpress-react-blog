import { useEffect, useRef, useState } from "react";
import { getFilteredPosts } from "../api/posts";
import { postCache } from "../cache/postCache.js";

const PER_PAGE = 6;

export function useInfinitePosts() {
  const [filters, setFilters] = useState({
    category: null,
    city: null,
  });

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  // LOAD CACHE WHEN FILTERS CHANGE
  useEffect(() => {
    const cached = postCache.get(filters);

    if (cached?.length) {
      setPosts(cached);
      setPage(Math.ceil(cached.length / PER_PAGE) + 1);
      setHasMore(true);
    } else {
      setPosts([]);
      setPage(1);
      setHasMore(true);
    }
  }, [filters]);

  const changeFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const fetchPosts = async () => {
    if (isFetching.current || !hasMore) return;

    try {
      isFetching.current = true;
      setLoading(true);
      setError(false);

      const data = await getFilteredPosts({
        page,
        category: filters.category,
        city: filters.city,
      });

      if (!Array.isArray(data) || !data.length) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const map = new Map();

        [...prev, ...data].forEach((p) => {
          map.set(p.id, p);
        });

        const merged = Array.from(map.values());

        postCache.set(data, filters, page);

        return merged;
      });

      if (data.length < PER_PAGE) {
        setHasMore(false);
      }
    } catch (e) {
      if (e?.response?.status === 400) {
        setHasMore(false);
      } else {
        console.error(e);
        setError(true);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const cached = postCache.get(filters, page);

      // 1. ako postoji cache za ovu stranicu
      if (cached?.length) {
        setPosts((prev) => {
          const map = new Map();

          [...prev, ...cached].forEach((p) => {
            map.set(p.id, p);
          });

          return Array.from(map.values());
        });

        return;
      }

      // 2. ako nema cache → fetch
      await fetchPosts();
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [page, filters]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((p) => p + 1);
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    filters,
    changeFilters,
  };
}
