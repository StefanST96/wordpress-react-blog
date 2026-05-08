import { useEffect, useRef, useState } from "react";
import { getFilteredPosts } from "../api/posts";
import { postCache } from "../cache/postCache.js";

const PER_PAGE = 6;

export function usePaginationPosts(filters, debouncedSearch) {
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

      postCache.set(
        data,
        { ...currentFilters, search: currentSearch },
        currentPage,
      );

      setPosts(data);

      setHasMore(data.length === PER_PAGE);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // RESET when filters/search change
  useEffect(() => {
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

    fetchPosts(1, filters, debouncedSearch);
  }, [filters.category, filters.city, debouncedSearch]);

  // PAGE CHANGE
  useEffect(() => {
    const currentFilters = filtersRef.current;
    const currentSearch = searchRef.current;

    const cacheFilters = {
      ...currentFilters,
      search: currentSearch,
    };

    const cached = postCache.get(cacheFilters, page);

    if (cached?.length) {
      setPosts(cached);
      return;
    }

    fetchPosts(page, currentFilters, currentSearch);
  }, [page]);

  const nextPage = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
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
