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

const mergePosts = (prev, incoming) => {
  const map = new Map();

  [...prev, ...incoming].forEach((p) => {
    map.set(p.id, p);
  });

  return Array.from(map.values());
};

export function useInfinitePosts(filters, debouncedSearch) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const filtersRef = useRef(filters);
  const searchRef = useRef(debouncedSearch);

  useEffect(() => {
    filtersRef.current = filters;
    searchRef.current = debouncedSearch;
  }, [filters, debouncedSearch]);

  const fetchPosts = async (
    currentPage,
    currentFilters,
    currentSearch,
    append = false,
  ) => {
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

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      const optimized = optimizePosts(data);

      postCache.set(
        optimized,
        {
          ...currentFilters,
          search: currentSearch,
        },
        currentPage,
      );

      setPosts((prev) => (append ? mergePosts(prev, optimized) : optimized));

      setHasMore(data.length === PER_PAGE);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // RESET WHEN FILTERS OR SEARCH CHANGE
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);

    const cacheFilters = {
      ...filters,
      search: debouncedSearch,
    };

    const cached = postCache.get(cacheFilters, 1);

    if (cached?.length) {
      setPosts(cached);
      return;
    }

    fetchPosts(1, filters, debouncedSearch, false);
  }, [filters.category, filters.city, debouncedSearch]);

  // LOAD MORE
  const loadMore = () => {
    if (loading || !hasMore) return;

    setPage((p) => p + 1);
  };

  // PAGE CHANGE
  useEffect(() => {
    if (page === 1) return;

    const currentFilters = filtersRef.current;
    const currentSearch = searchRef.current;

    const cacheFilters = {
      ...currentFilters,
      search: currentSearch,
    };

    const cached = postCache.get(cacheFilters, page);

    if (cached?.length) {
      setPosts((prev) => mergePosts(prev, cached));
      return;
    }

    fetchPosts(page, currentFilters, currentSearch, true);
  }, [page]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
