import styles from "./PostCardSkeleton.module.scss";

const PostCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.image} />

      <div className={styles.title} />

      <div className={styles.line} />
      <div className={styles.lineShort} />
    </div>
  );
};

export default PostCardSkeleton;
