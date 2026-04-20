import React from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { Input } from "../../components/Input/Input";
import styles from "./Posts.module.scss";
import { useState } from "react";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "../../components/PostCard/PostCard";

const Posts = () => {
  const { posts, loading, error } = usePosts();
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((post) =>
    post?.title?.rendered?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <Loader />;
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
        <p className={styles.empty}>Nema postova za pretragu.</p>
      ) : (
        <div className={styles.list}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
