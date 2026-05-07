import { useEffect, useRef, useState } from "react";
import { getFilteredPosts } from "../api/posts";
import { postCache } from "../cache/postCache.js";

const PER_PAGE = 6;

const mergePosts = (prev, incoming) => {
  const map = new Map();
  [...prev, ...incoming].forEach((p) => map.set(p.id, p));
  return Array.from(map.values());
};

export function useInfinitePosts(filters, debouncedSearch) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);
  // Keep a ref to always-current filters so effects don't go stale
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  });

  const fetchPosts = async (currentPage, currentFilters, append = false) => {
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);
      setError(false);

      const data = await getFilteredPosts({
        page: currentPage,
        category: currentFilters.category,
        city: currentFilters.city,
      });

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      // Save to cache BEFORE setState, using currentFilters (not stale closure)
      postCache.set(data, currentFilters, currentPage);

      setPosts((prev) => append ? mergePosts(prev, data) : data);

      if (data.length < PER_PAGE) {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // RESET + FETCH PAGE 1 WHEN FILTERS CHANGE (check cache first)
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);

    const cached = postCache.get(filters, 1);
    if (cached?.length) {
      setPosts(cached);
      return;
    }

    fetchPosts(1, filters, false);
  }, [filters.category, filters.city]);

  // LOAD MORE
  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((p) => p + 1);
  };

  // PAGE CHANGE TRIGGERS FETCH (page > 1 only)
  useEffect(() => {
    if (page === 1) return;

    const currentFilters = filtersRef.current;
    const cached = postCache.get(currentFilters, page);

    if (cached?.length) {
      setPosts((prev) => mergePosts(prev, cached));
      return;
    }

    fetchPosts(page, currentFilters, true);
  }, [page]);

  // SEARCH FILTER (CLIENT SIDE)
  const safePosts = Array.isArray(posts) ? posts : [];
  const searchedPosts =
    (debouncedSearch ?? "").trim() === ""
      ? safePosts
      : safePosts.filter((post) =>
          post?.title?.rendered
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
        );

  return {
    posts: searchedPosts,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
