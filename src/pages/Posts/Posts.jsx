import React, { useEffect, useState } from "react";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import PostCard from "./PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import styles from "./Posts.module.scss";

import { useDebounce } from "../../hooks/useDebounce";
import { usePaginationPosts } from "../../hooks/usePaginationPosts";
import { getCategories, getCities } from "../../api/posts";

const PER_PAGE = 14;

const Posts = () => {
  const [filters, setFilters] = useState({
    category: "all",
    city: "all",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const { posts, page, loading, error, hasMore, nextPage, prevPage } =
    usePaginationPosts(filters, debouncedSearch);

  const changeFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [c, ci] = await Promise.all([getCategories(), getCities()]);
        setCategories(c || []);
        setCities(ci || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

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
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCategoryClick={(catId) => changeFilters("category", catId)}
            />
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={page === 1 || loading}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={nextPage} disabled={!hasMore || loading}>
          Next
        </button>
      </div>

      {loading && posts.length > 0 && (
        <p style={{ textAlign: "center" }}>Učitavanje...</p>
      )}
      {!loading && posts.length === 0 && (
        <p style={{ textAlign: "center" }}>Nema rezultata.</p>
      )}
      {error && (
        <p style={{ textAlign: "center" }}>
          Došlo je do greške prilikom učitavanja postova.
        </p>
      )}
    </div>
  );
};

export default Posts;
