import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import PostCard from "./PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import styles from "./Posts.module.scss";
import { Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { usePaginationPosts } from "../../hooks/usePaginationPosts";
import { getCategories, getCities } from "../../api/posts";
import { Button } from "../../components/UI/Button/Button";
import heroImage from "../../assets/hero.png";

const Posts = () => {
  const [filters, setFilters] = useState({
    category: "all",
    city: "all",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const { posts, page, setPage, loading, error, hasMore, PER_PAGE } =
    usePaginationPosts(filters, debouncedSearch);

  const changeFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  // load data
  useEffect(() => {
    const load = async () => {
      try {
        const cachedCategories = localStorage.getItem("categories");
        const cachedCities = localStorage.getItem("cities");

        if (cachedCategories && cachedCities) {
          setCategories(JSON.parse(cachedCategories));
          setCities(JSON.parse(cachedCities));
          return;
        }

        const [c, ci] = await Promise.all([getCategories(), getCities()]);

        setCategories(c || []);
        setCities(ci || []);

        localStorage.setItem("categories", JSON.stringify(c || []));
        localStorage.setItem("cities", JSON.stringify(ci || []));
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  const quickCategories = useMemo(() => {
    return categories.filter((c) => c.parent !== 0).slice(0, 8);
  }, [categories]);

  const getPagination = (current, total) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    let left = current - delta;
    let right = current + delta;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    let prev;
    for (let i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const totalPages = hasMore ? page + 1 : page;

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <img src={heroImage} className={styles.heroImage} alt="" />

        <div className={styles.overlay}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Poslovni adresar Srbije</span>

            <h1 className={styles.heroTitle}>
              Pronađite najbolje firme i usluge
            </h1>

            <p className={styles.heroText}>
              Brzo i lako pronađite firme i kvalitetne usluge u vašem gradu.
            </p>

            {/* SEARCH */}
            <div className={styles.heroSearch}>
              <Search className={styles.searchIcon} />

              <Input
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                placeholder="Pretraga..."
              />

              <Select
                value={filters.category}
                onChange={(v) =>
                  changeFilters("category", v === "all" ? "all" : Number(v))
                }
                options={[
                  { id: "all", label: "Sve kategorije", value: "all" },
                  ...categories.map((c) => ({
                    id: c.id,
                    label: c.name,
                    value: c.id,
                  })),
                ]}
              />

              <Select
                value={filters.city}
                onChange={(v) =>
                  changeFilters("city", v === "all" ? "all" : Number(v))
                }
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

            {/* QUICK CATEGORIES */}
            {quickCategories.length > 0 && (
              <div className={styles.quickCategories}>
                {quickCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={styles.quickCategory}
                    onClick={() => changeFilters("category", cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <Button
          navButton
          title="Prethodna"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        />

        {getPagination(page, totalPages).map((item, index) =>
          item === "..." ? (
            <span key={index} className={styles.dots}>
              ...
            </span>
          ) : (
            <Button
              key={index}
              pageButton
              title={item}
              active={page === item}
              onClick={() => setPage(item)}
              disabled={loading}
            />
          ),
        )}

        <Button
          navButton
          title="Sledeća"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore || loading}
        />
      </div>

      {/* STATES */}
      {loading && posts.length > 0 && (
        <p className={styles.empty}>Učitavanje...</p>
      )}

      {!loading && posts.length === 0 && (
        <p className={styles.empty}>Nema rezultata.</p>
      )}

      {error && (
        <p className={styles.empty}>Došlo je do greške prilikom učitavanja.</p>
      )}
    </div>
  );
};

export default Posts;
