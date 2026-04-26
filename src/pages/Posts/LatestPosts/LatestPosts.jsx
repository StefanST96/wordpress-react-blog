import { useEffect, useState } from "react";
import styles from "./LatestPosts.module.scss";
import { getLatestPosts } from "../../../api/posts";

const LatestPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getLatestPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className={styles.section}>
      <h2>Latest Posts</h2>

      <div className={styles.postsGrid}>
        {posts.map((post) => {
          const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

          return (
            <div key={post.id} className={styles.postCard}>
              {image && <img src={image} alt="" />}

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
    </section>
  );
};

export default LatestPosts;
