import React from "react";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import { Input } from "../../components/UI/Input/Input";
import styles from "./Posts.module.scss";
import { useState } from "react";
import { usePosts } from "../../hooks/usePosts";
import { useDebounce } from "../../hooks/useDebounce";
import PostCard from "../../components/Post/PostCard/PostCard";

const Posts = () => {
  const { posts, loading, error, loadMore, hasMore } = usePosts();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const filteredPosts = posts.filter((post) =>
    post?.title?.rendered
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase()),
  );

  const TEXT = {
    title: "WordPress Postovi",
    empty: "Nema postova za pretragu",
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} title />
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
      <h1 className={styles.title}>WordPress Postovi</h1>

      <Input
        type="text"
        placeholder="Pretraži postove..."
        value={search}
        onChange={setSearch}
        customClass="button search"
      />

      {filteredPosts.length === 0 ? (
        <p className={styles.empty} empty />
      ) : (
        <div className={styles.list}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Učitavanje...</p>}

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="button warning"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Učitavanje..." : "Učitaj još"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
