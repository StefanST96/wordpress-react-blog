import { useEffect, useRef, useState } from "react";
import { getFilteredPosts } from "../api/posts";
import { postCache } from "../cache/postCache.js";

const PER_PAGE = 12;

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
  const initialCacheKey = { ...filters, search: debouncedSearch };
  const initialCached = postCache.get(initialCacheKey, 1);

  const [posts, setPosts] = useState(initialCached ?? []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(!initialCached);
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
        return;
      }

      const optimized = optimizePosts(data);

      postCache.set(
        optimized,
        { ...currentFilters, search: currentSearch },
        currentPage,
      );

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

  // FILTER / SEARCH CHANGE
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    const cacheKey = {
      ...filters,
      search: debouncedSearch,
    };

    const cached = postCache.get(cacheKey, 1);

    if (cached?.length) {
      setPosts(cached);
      setLoading(false);
      return;
    }

    fetchPosts(1, filters, debouncedSearch);
  }, [filters.category, filters.city, debouncedSearch]);

  // PAGE CHANGE
  useEffect(() => {
    // spreči dupli fetch na mount-u
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const currentFilters = filtersRef.current;
    const currentSearch = searchRef.current;

    const cacheKey = {
      ...currentFilters,
      search: currentSearch,
    };

    const cached = postCache.get(cacheKey, page);

    if (cached?.length) {
      setPosts(cached);
      setLoading(false);
      return;
    }

    fetchPosts(page, currentFilters, currentSearch);
  }, [page]);

  const nextPage = () => {
    if (!loading && hasMore) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1 && !loading) {
      setPage((p) => p - 1);
    }
  };

  return {
    posts,
    page,
    loading,
    error,
    hasMore,
    nextPage,
    prevPage,
    setPage,
  };
}
