import { useEffect, useState } from "react";
import { getData } from "../services";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getData("/posts?_embed");
        if (data) setPosts(data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}