import React, { useEffect, useState } from "react";
import { getData } from "../../services";
import Loader from "../../components/Loader/Loader";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./Posts.module.scss";

const Posts = () => {
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

  if (loading) return <Loader />;
  if (error) return <p>Došlo je do greške prilikom učitavanja postova.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>WordPress Postovi</h1>
      {posts.map((post) => (
        <div key={post.id} className={styles.post}>
          <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h2>
          <div
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          ></div>

          {/* Featured image */}
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <img
              src={
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "/default-image.jpg"
              }
              alt={post.title.rendered}
              className={styles.postImage}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
