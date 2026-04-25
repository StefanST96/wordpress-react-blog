import React, { useState } from "react";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import { Input } from "../../components/UI/Input/Input";
import styles from "./Posts.module.scss";
import { useInfinitePosts } from "../../hooks/useInfinitePosts";
import { useDebounce } from "../../hooks/useDebounce";
import PostCard from "../../components/Post/PostCard/PostCard";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const Posts = () => {
  const { posts, loading, error, loadMore, hasMore } = useInfinitePosts();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const filteredPosts = posts.filter((post) =>
    post?.title?.rendered
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase()),
  );

  const lastPostRef = useInfiniteScroll(loadMore, hasMore, loading);

  const TEXT = {
    title: "WordPress Postovi",
    empty: "Nema postova za pretragu",
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{TEXT.title}</h1>

        <Input
          type="text"
          placeholder="Pretraži postove..."
          value={search}
          onChange={setSearch}
          customClass="button search"
        />

        <div className={styles.list}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Došlo je do greške prilikom učitavanja postova.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{TEXT.title}</h1>

      <Input
        type="text"
        placeholder="Pretraži postove..."
        value={search}
        onChange={setSearch}
        customClass="button search"
      />

      {filteredPosts.length === 0 ? (
        <p className={styles.empty}>{TEXT.empty}</p>
      ) : (
        <div className={styles.list}>
          {filteredPosts.map((post, index) => {
            const isLast = index === filteredPosts.length - 1;

            return (
              <div key={post.id} ref={isLast ? lastPostRef : null}>
                <PostCard post={post} />
              </div>
            );
          })}
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Učitavanje...</p>}
    </div>
  );
};

export default Posts;
