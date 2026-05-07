import React, { useEffect, useState } from "react";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import PostCard from "./PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import styles from "./Posts.module.scss";

import { useInfinitePosts } from "../../hooks/useInfinitePosts";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import { getCategories, getCities } from "../../api/posts";

const Posts = () => {
  const [filters, setFilters] = useState({
    category: "all",
    city: "all",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const changeFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { posts, loading, error, hasMore, loadMore } = useInfinitePosts(
    filters,
    debouncedSearch,
  );

  useEffect(() => {
    const load = async () => {
      const [c, ci] = await Promise.all([getCategories(), getCities()]);

      setCategories(c || []);
      setCities(ci || []);
    };

    load();
  }, []);

  const isSearching = debouncedSearch.length > 0;

  const lastPostRef = useInfiniteScroll(
    isSearching ? () => {} : loadMore,
    isSearching ? false : hasMore,
    loading,
  );

  if (error) {
    return (
      <p style={{ textAlign: "center" }}>
        Došlo je do greške prilikom učitavanja postova.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <Input value={search} onChange={setSearch} placeholder="Pretraga..." />

        <Select
          value={filters.category}
          onChange={(v) => changeFilters("category", v)}
          options={[
            { id: "all", label: "Sve kategorije", value: "all" },
            ...categories.map((c) => ({
              id: c.id,
              label: `${c.parent ? "— " : ""}${c.name}`,
              value: c.id,
            })),
          ]}
        />

        <Select
          value={filters.city}
          onChange={(v) => changeFilters("city", v)}
          options={[
            { id: "all", label: "Svi gradovi", value: "all" },
            ...cities.map((c) => ({
              id: c.id,
              label: c.name,
              value: c.id,
            })),
          ]}
        />
      </div>
      <h1>Firme i usluge</h1>
      {loading && posts.length === 0 ? (
        <div className={styles.list}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post, i) => {
            const isLast = i === posts.length - 1;

            return (
              <div key={post.id} ref={isLast ? lastPostRef : null}>
                <PostCard
                  post={post}
                  onCategoryClick={(catId) => changeFilters("category", catId)}
                />
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
