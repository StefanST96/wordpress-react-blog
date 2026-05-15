import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const ALLOWED_CATEGORY_IDS = [
  2204, // Zdravstvo
  2234, // Deca
  2214, // Auto-moto
  2259, // Sport
  2263, // Obrazovanje
  3110, // Usluge
  2222, // Ugostiteljstvo
  2175, // Turizam i transport
  2343, // Trgovina
  2728, // Galanterija
  2183, // Gradjevinstvo
  2483, // Hrana
  2185, // Kuca
  2187, // Nega lica i tela
  2180, // Mediji
  2275, // Elektronika
  2863, // Agro
  2311, // Kultura
];

const CATEGORY_LABELS = {
  2204: "Zdravstvo",
  2234: "Deca",
  2214: "Auto-moto",
  2259: "Sport",
  2263: "Obrazovanje",
  3110: "Usluge",
  2222: "Ugostiteljstvo",
  2175: "Turizam i transport",
  2343: "Trgovina",
  2728: "Galanterija",
  2183: "Gradjevinstvo",
  2483: "Hrana",
  2185: "Kuca",
  2187: "Nega lica i tela",
  2180: "Mediji",
  2275: "Elektronika",
  2863: "Agro",
  2311: "Kultura",
};

const Posts = () => {
  const listRef = useRef(null);

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

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setFilters((prev) => ({
        ...prev,
        category: categoryId,
      }));

      setPage(1);

      setTimeout(() => {
        listRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    },
    [setPage],
  );

  useEffect(() => {
    const CACHE_TTL = 60 * 60 * 1000;
    const CACHE_VERSION = "v3";

    const load = async () => {
      try {
        const cachedVersion = localStorage.getItem("categories_version");

        const cachedCategories = localStorage.getItem("categories");

        const cachedCities = localStorage.getItem("cities");

        const cachedAt = Number(
          localStorage.getItem("categories_cached_at") || 0,
        );

        const cacheValid =
          cachedVersion === CACHE_VERSION && Date.now() - cachedAt < CACHE_TTL;

        if (cachedCategories && cachedCities && cacheValid) {
          setCategories(JSON.parse(cachedCategories));

          setCities(JSON.parse(cachedCities));

          return;
        }

        localStorage.removeItem("categories");

        localStorage.removeItem("cities");

        localStorage.removeItem("categories_cached_at");

        localStorage.removeItem("categories_version");

        const [c, ci] = await Promise.all([getCategories(), getCities()]);

        setCategories(c || []);
        setCities(ci || []);

        localStorage.setItem("categories", JSON.stringify(c || []));

        localStorage.setItem("cities", JSON.stringify(ci || []));

        localStorage.setItem("categories_cached_at", String(Date.now()));

        localStorage.setItem("categories_version", CACHE_VERSION);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  const directoryCategories = useMemo(() => {
    return categories.filter((c) =>
      ALLOWED_CATEGORY_IDS.includes(Number(c.id ?? 0)),
    );
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
            <h2 className={styles.heroText}>
              Brzo i lako pronađite firme i kvalitetne usluge u vašem gradu.
            </h2>
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
                placeholder="Sve kategorije"
                onChange={(v) =>
                  changeFilters("category", v === "all" ? "all" : Number(v))
                }
                options={[
                  {
                    id: "all",
                    label: "Sve kategorije",
                    value: "all",
                  },

                  ...categories.map((c) => ({
                    id: c.id,
                    label: c.name,
                    value: c.id,
                  })),
                ]}
              />

              <Select
                value={filters.city}
                placeholder="Svi gradovi"
                onChange={(v) =>
                  changeFilters("city", v === "all" ? "all" : Number(v))
                }
                options={[
                  {
                    id: "all",
                    label: "Svi gradovi",
                    value: "all",
                  },

                  ...cities.map((c) => ({
                    id: c.id,
                    label: c.name,
                    value: c.id,
                  })),
                ]}
              />
            </div>
            {/* QUICK CATEGORIES */}
            {directoryCategories.length > 0 && (
              <div className={styles.quickCategories}>
                {directoryCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={styles.quickCategory}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {CATEGORY_LABELS[cat.id] || cat.name}
                  </button>
                ))}
                {filters.category !== "all" && (
                  <button
                    className={styles.categoryReset}
                    onClick={() => handleCategorySelect("all")}
                  >
                    ✕ Prikaži sve kategorije
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div ref={listRef} className={styles.listAnchor} />

      {loading && posts.length === 0 ? (
        <div className={styles.list}>
          {Array.from({
            length: PER_PAGE,
          }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCategoryClick={(catId) => handleCategorySelect(catId)}
            />
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
