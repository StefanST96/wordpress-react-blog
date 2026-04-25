import { useCallback, useRef } from "react";

export function useInfiniteScroll(callback, hasMore, loading) {
  const observer = useRef(null);

  return useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [callback, hasMore, loading],
  );
}
