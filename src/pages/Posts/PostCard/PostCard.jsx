import React from "react";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.scss";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className={styles.card}>
      <h2
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <div
        className={styles.excerpt}
        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
      />

      {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
        <img
          className={styles.image}
          src={post._embedded["wp:featuredmedia"][0].source_url}
          alt={post.title.rendered}
        />
      )}
      <p className={styles.meta}>
        <span className={styles.date}>
          {new Date(post.date).toLocaleDateString("sr-RS", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>

        <span className={styles.category}>
          {" • "}
          {post._embedded?.["wp:term"]?.[0]?.map((cat) => cat.name).join(", ")}
        </span>
      </p>
    </Link>
  );
};

export default PostCard;
