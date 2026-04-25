import { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/posts";
import { postCache } from "../cache/postCache";

export function useInfinitePosts() {
  const cached = postCache.get();

  const [posts, setPosts] = useState(cached || []);
  const [page, setPage] = useState(
    cached ? Math.ceil(cached.length / 6) + 1 : 1,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const fetchPosts = async () => {
    if (isFetching.current || !hasMore) return;

    try {
      isFetching.current = true;
      setLoading(true);

      const data = await getPosts(page);

      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const map = new Map();

        [...prev, ...data].forEach((post) => {
          map.set(post.id, post);
        });

        const merged = Array.from(map.values());

        // CACHE UPDATE
        postCache.set(merged);

        return merged;
      });

      if (data.length < 6) {
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

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  return { posts, loading, error, hasMore, loadMore };
}
