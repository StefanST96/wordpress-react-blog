import { useEffect, useState } from "react";
import styles from "./LatestPosts.module.scss";
import { getLatestPosts } from "../../../api/posts";
import LatestPostsSkeleton from "../../../components/UI/Skeleton/LatestPostsSkeleton";

const CACHE_KEY = "latest_posts_v1";

const getCached = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { posts, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return posts;
  } catch {
    return null;
  }
};

const setCached = (posts) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }));
  } catch {}
};

const LatestPosts = () => {
  const cachedPosts = getCached();

  const [posts, setPosts] = useState(
    Array.isArray(cachedPosts) ? cachedPosts : [],
  );

  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    if (cachedPosts) return;

    const fetchPosts = async () => {
      try {
        const data = await getLatestPosts();

        const safeData = Array.isArray(data) ? data : [];

        setPosts(safeData);
        setCached(safeData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className={styles.section}>
      <h2>Latest Posts</h2>

      {loading ? (
        <LatestPostsSkeleton />
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => {
            const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <div key={post.id} className={styles.postCard}>
                {image && (
                  <img src={image} alt={post.title.rendered} loading="lazy" />
                )}

                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />

                <p>
                  {post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 100)}
                  ...
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LatestPosts;
