import { useEffect, useState } from "react";
import styles from "./LatestPosts.module.scss";
import { getLatestPosts } from "../../../api/posts";
import { postCache } from "../../../cache/postCache";
import LatestPostsSkeleton from "../../../components/UI/Skeleton/LatestPostsSkeleton";

const CACHE_KEY = "latest";

const LatestPosts = () => {
  const cachedPosts = postCache.get(CACHE_KEY);

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

        postCache.set(safeData, CACHE_KEY);
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
