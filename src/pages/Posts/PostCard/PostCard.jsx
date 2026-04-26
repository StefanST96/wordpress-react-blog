import React from "react";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.scss";

const PostCard = ({ post, onCategoryClick }) => {
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/fallback.jpg";

  const categories = post._embedded?.["wp:term"]?.[0] || [];

  return (
    <Link to={`/post/${post.id}`} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.metaTop}>
          {categories.map((cat) => (
            <span
              key={cat.id}
              className={styles.category}
              onClick={(e) => {
                e.preventDefault(); // ne triggeruje Link navigaciju
                e.stopPropagation();
                onCategoryClick(cat.id);
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h2
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <p className={styles.excerpt}>
          {post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 140)}
          ...
        </p>

        <div className={styles.metaBottom}>
          <span className={styles.date}>
            {new Date(post.date).toLocaleDateString("sr-RS", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      <img src={image} alt="" className={styles.image} />
    </Link>
  );
};

export default PostCard;
