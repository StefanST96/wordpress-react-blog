import { useEffect, useRef, useState } from "react";
import { getPosts, getPostsByCategory } from "../api/posts";
import { postCache } from "../cache/postCache.js";

export function useInfinitePosts() {
  const [activeCategory, setActiveCategory] = useState(null);

  const cached = postCache.get(activeCategory);

  const [posts, setPosts] = useState(Array.isArray(cached) ? cached : []);

  const [page, setPage] = useState(
    Array.isArray(cached) ? Math.ceil(cached.length / 6) + 1 : 1,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const changeCategory = (catId) => {
    setActiveCategory(catId);
    setPosts([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchPosts = async () => {
    if (isFetching.current || !hasMore) return;

    try {
      isFetching.current = true;
      setLoading(true);

      const data = activeCategory
        ? await getPostsByCategory(activeCategory, page)
        : await getPosts(page);

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const map = new Map();
        [...safePrev, ...data].forEach((post) => {
          map.set(post.id, post);
        });
        const merged = Array.from(map.values());
        postCache.set(merged, activeCategory);
        return merged;
      });

      if (data.length < 6) {
        setHasMore(false);
      }
    } catch (e) {
      // 400 = nema više stranica, nije greška
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
    fetchPosts();
  }, [page, activeCategory]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    changeCategory,
    activeCategory,
  };
}
