import { useEffect, useState } from "react";
import { getPostBySlug } from "../api/posts";

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const data = await getPostBySlug(slug);

        if (data) setPost(data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  return { post, loading, error };
}