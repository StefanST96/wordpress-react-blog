import { useEffect, useRef, useState } from "react";
import { getFilteredPosts } from "../api/posts";
import { postCache } from "../cache/postCache.js";

const PER_PAGE = 14;

const optimizePosts = (data = []) => {
  return data.map((post) => ({
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: {
      rendered: post.title?.rendered || "",
    },

    excerpt: {
      rendered: post.excerpt?.rendered || "",
    },

    categories: post.categories || [],

    _embedded: {
      "wp:featuredmedia":
        post._embedded?.["wp:featuredmedia"]?.map((m) => ({
          source_url: m.source_url,
        })) || [],
    },
  }));
};

export function usePaginationPosts(filters, debouncedSearch) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);
  const mounted = useRef(false);

  const filtersRef = useRef(filters);
  const searchRef = useRef(debouncedSearch);

  useEffect(() => {
    filtersRef.current = filters;
    searchRef.current = debouncedSearch;
  }, [filters, debouncedSearch]);

  const fetchPosts = async (currentPage, currentFilters, currentSearch) => {
    if (isFetching.current) return;

    const cacheKey = {
      ...currentFilters,
      search: currentSearch,
    };

    // ✅ CACHE CHECK
    const cached = postCache.get(cacheKey, currentPage);

    if (cached) {
      setPosts(cached);
      setHasMore(cached.length === PER_PAGE);
      return;
    }

    try {
      isFetching.current = true;
      setLoading(true);
      setError(false);

      const data = await getFilteredPosts({
        page: currentPage,
        perPage: PER_PAGE,
        category: currentFilters.category,
        city: currentFilters.city,
        search: currentSearch,
      });

      if (!Array.isArray(data)) {
        setHasMore(false);
        setPosts([]);
        return;
      }

      const optimized = optimizePosts(data);

      // ✅ SAVE CACHE
      postCache.set(optimized, cacheKey, currentPage);

      setPosts(optimized);
      setHasMore(data.length === PER_PAGE);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // reset na filter/search
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    fetchPosts(1, filters, debouncedSearch);
  }, [filters.category, filters.city, debouncedSearch]);

  // page change
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    fetchPosts(page, filtersRef.current, searchRef.current);
  }, [page]);

  return {
    posts,
    page,
    setPage,
    loading,
    error,
    hasMore,
    PER_PAGE,
  };
}
