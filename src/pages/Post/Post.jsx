import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getData } from "../../services";
import Loader from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";
import styles from "./Post.module.scss";

const Post = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getData(`/posts/${id}?_embed`);

        if (data) {
          setPost(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !post) return <p>Post nije pronađen.</p>;

  return (
    <div className={styles.container}>
      <Link to="/posts">
        <Button title="< Nazad" warning small />
      </Link>
      <h1
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
        <img
          className={styles.image}
          src={post._embedded["wp:featuredmedia"][0].source_url}
          alt={post.title.rendered}
        />
      )}

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
};

export default Post;
