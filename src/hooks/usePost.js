import { useEffect, useState } from "react";
import { getPost } from "../api/posts";

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const data = await getPost(id);

        if (data) setPost(data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  return { post, loading, error };
}