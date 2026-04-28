import React, { useEffect, useState } from "react";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import styles from "./Posts.module.scss";
import { useInfinitePosts } from "../../hooks/useInfinitePosts";
import { useDebounce } from "../../hooks/useDebounce";
import PostCard from "./PostCard/PostCard";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { getCategories } from "../../api/posts";

const Posts = () => {
  const {
    posts,
    loading,
    error,
    loadMore,
    hasMore,
    changeCategory,
    activeCategory,
  } = useInfinitePosts();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const debouncedSearch = useDebounce(search, 300);
  const isSearching = debouncedSearch.length > 0;

  const TEXT = {
    title: "Vesti",
    empty: "Nema postova za pretragu",
  };

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Categories error:", err);
      }
    };

    fetchCategories();
  }, []);

  // SAFE POSTS
  const safePosts = Array.isArray(posts) ? posts : [];

  // FILTER LOGIC
  // Kategorije filtrira API — ovde samo search
  const searchedPosts = safePosts.filter((post) =>
    post?.title?.rendered
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase()),
  );

  // STOP INFINITE SCROLL DURING SEARCH
  const lastPostRef = useInfiniteScroll(
    isSearching ? () => {} : loadMore,
    isSearching ? false : hasMore,
    loading,
  );

  // REUSABLE UI BLOCKS
  const searchInput = (
    <Input
      type="text"
      placeholder="Pretraži postove..."
      value={search}
      onChange={setSearch}
      center
      customClass="button search"
    />
  );

  const categorySelect = (
    <Select
      value={activeCategory}
      onChange={(val) => changeCategory(val)}
      options={[
        { id: 0, label: "All categories", value: null },
        ...categories.map((cat) => ({
          id: cat.id,
          label: `${cat.parent ? "— " : ""}${cat.name}`,
          value: cat.id,
        })),
      ]}
      marginNone
      placeholder="All categories"
    />
  );

  // LOADING STATE (FIRST LOAD)
  if (loading && safePosts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{TEXT.title}</h1>
        <section className={styles.filter}>
          {searchInput}
          {categorySelect}
        </section>
        <div className={styles.list}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: "center" }}>
        Došlo je do greške prilikom učitavanja postova.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{TEXT.title}</h1>

      {/* FILTER BAR */}
      <section className={styles.filter}>
        {searchInput}
        {categorySelect}
      </section>
      {/* POSTS */}
      {searchedPosts.length === 0 ? (
        <p className={styles.empty}>{TEXT.empty}</p>
      ) : (
        <div className={styles.list}>
          {searchedPosts.map((post, index) => {
            const isLast = index === searchedPosts.length - 1;

            return (
              <div key={post.id} ref={isLast ? lastPostRef : null}>
                <PostCard post={post} onCategoryClick={changeCategory} />
              </div>
            );
          })}
        </div>
      )}

      {/* LOADING MORE */}
      {loading && safePosts.length > 0 && !isSearching && (
        <p style={{ textAlign: "center" }}>Učitavanje...</p>
      )}
    </div>
  );
};

export default Posts;
