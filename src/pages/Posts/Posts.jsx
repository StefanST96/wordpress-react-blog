import React, { useEffect, useState } from "react";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import PostCard from "./PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import styles from "./Posts.module.scss";

import { useDebounce } from "../../hooks/useDebounce";
import { getCategories, getCities, getFilteredPosts } from "../../api/posts";

const PER_PAGE = 6;

const Posts = () => {
  const [filters, setFilters] = useState({
    category: "all",
    city: "all",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const changeFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // FETCH POSTS (SINGLE SOURCE OF TRUTH)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getFilteredPosts({
          page,
          category: filters.category,
          city: filters.city,
          search: debouncedSearch,
          perPage: PER_PAGE,
        });

        if (!Array.isArray(data)) {
          setPosts([]);
          setHasMore(false);
          return;
        }

        setPosts(data);
        setHasMore(data.length === PER_PAGE);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, filters.category, filters.city, debouncedSearch]);

  // RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.city, debouncedSearch]);

  // LOAD FILTER OPTIONS
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

      {/* LIST */}
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

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => {
            if (hasMore && !loading) setPage((p) => p + 1);
          }}
          disabled={!hasMore || loading}
        >
          Next
        </button>
      </div>

      {/* STATES */}
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
