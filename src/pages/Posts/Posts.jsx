import React, { useEffect, useState } from "react";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import { Input } from "../../components/UI/Input/Input";
import { Select } from "../../components/UI/Select/Select";
import styles from "./Posts.module.scss";

import { useInfinitePosts } from "../../hooks/useInfinitePosts";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import PostCard from "./PostCard/PostCard";

import { getCategories, getCities } from "../../api/posts";

const Posts = () => {
  const { posts, loading, error, loadMore, hasMore, filters, changeFilters } =
    useInfinitePosts();

  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const debouncedSearch = useDebounce(search, 300);

  const isSearching = debouncedSearch.length > 0;

  const TEXT = {
    title: "Firme i usluge",
    empty: "Nema postova za pretragu",
  };

  // FETCH FILTER DATA
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, citiesData] = await Promise.all([
          getCategories(),
          getCities(),
        ]);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (err) {
        console.error("Filters error:", err);
      }
    };

    fetchFilters();
  }, []);

  // SAFE POSTS
  const safePosts = Array.isArray(posts) ? posts : [];

  // LOCAL SEARCH FILTER
  const searchedPosts = safePosts.filter((post) =>
    post?.title?.rendered
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase()),
  );

  // INFINITE SCROLL
  const lastPostRef = useInfiniteScroll(
    isSearching ? () => {} : loadMore,
    isSearching ? false : hasMore,
    loading,
  );

  // SEARCH INPUT
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

  // CATEGORY SELECT
  const categorySelect = (
    <Select
      value={filters.category}
      onChange={(val) =>
        changeFilters({
          category: val,
        })
      }
      options={[
        {
          id: 0,
          label: "Sve kategorije",
          value: null,
        },

        ...categories.map((cat) => ({
          id: cat.id,
          label: `${cat.parent ? "— " : ""}${cat.name}`,
          value: cat.id,
        })),
      ]}
      marginNone
      placeholder="Sve kategorije"
    />
  );

  // CITY SELECT
  const citySelect = (
    <Select
      value={filters.city}
      onChange={(val) =>
        changeFilters({
          city: val,
        })
      }
      options={[
        {
          id: 0,
          label: "Svi gradovi",
          value: null,
        },

        ...cities.map((city) => ({
          id: city.id,
          label: city.name,
          value: city.id,
        })),
      ]}
      marginNone
      placeholder="Svi gradovi"
    />
  );

  // INITIAL LOADING
  if (loading && safePosts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{TEXT.title}</h1>

        <section className={styles.filter}>
          {searchInput}
          {categorySelect}
          {citySelect}
        </section>

        <div className={styles.list}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ERROR
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
        {citySelect}
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
                <PostCard
                  post={post}
                  onCategoryClick={(categoryId) =>
                    changeFilters({
                      category: categoryId,
                    })
                  }
                />
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
