import { useEffect, useState } from "react";
import { getData } from "../services";

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getData(`/posts/${id}?_embed`);

        if (data) setPost(data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading, error };
}