import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber) => {
    try {
      setLoading(true);

      const data = await getPosts(pageNumber);

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return { posts, loading, error, loadMore, hasMore };
}