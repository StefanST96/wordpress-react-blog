import React from "react";
import styles from "./PostCard.module.scss";

const PostCard = ({ post }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{post.title.rendered}</h2>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
};

export default PostCard;
