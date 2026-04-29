import React from "react";
import styles from "./LatestPostsSkeleton.module.scss";

const LatestPostsSkeleton = () => {
  return (
    <div className={styles.grid}>
      {[...Array(3)].map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.image}></div>

          <div className={styles.content}>
            <div className={styles.title}></div>

            <div className={styles.text}></div>

            <div className={styles.textSmall}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestPostsSkeleton;
