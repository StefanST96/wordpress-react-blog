import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../Posts/PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import styles from "./Directory.module.scss";
import { getPosts, getBiznisVesti, getPosaoOglasi } from "../../api/posts";

const SECTION_COUNT = 6;
const TTL = 5 * 60 * 1000;

// Jednostavan session cache specifican za PoslovniAdresar
const sectionCache = {
  get(key) {
    try {
      const raw = sessionStorage.getItem("pa_" + key);
      if (!raw) return null;
      const { data, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) {
        sessionStorage.removeItem("pa_" + key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  set(key, data) {
    try {
      sessionStorage.setItem(
        "pa_" + key,
        JSON.stringify({ data, expiry: Date.now() + TTL }),
      );
    } catch {}
  },
};

const useSection = (fetchFn, cacheKey) => {
  const initialCached = sectionCache.get(cacheKey);

  const [posts, setPosts] = useState(initialCached ?? []);
  const [loading, setLoading] = useState(!initialCached);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialCached) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFn(1);
        const safe = Array.isArray(data) ? data.slice(0, SECTION_COUNT) : [];
        sectionCache.set(cacheKey, safe);
        setPosts(safe);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { posts, loading, error };
};

const SectionGrid = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return <p className={styles.empty}>Nema postova.</p>;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onCategoryClick={() => {}} />
      ))}
    </div>
  );
};

const Directory = () => {
  const latest = useSection(getPosts, "latest");
  const biznisVesti = useSection(getBiznisVesti, "biznis_vesti");
  const posaoOglasi = useSection(getPosaoOglasi, "posao_oglasi");

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Poslovni Adresar</h1>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Najnoviji postovi</h2>
          <Link to="/" className={styles.seeAll}>
            Pogledaj sve →
          </Link>
        </div>
        <SectionGrid posts={latest.posts} loading={latest.loading} />
        {latest.error && (
          <p className={styles.errorMsg}>Greška pri učitavanju.</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Biznis vesti</h2>
          <Link to="/?category=2857" className={styles.seeAll}>
            Pogledaj sve →
          </Link>
        </div>
        <SectionGrid posts={biznisVesti.posts} loading={biznisVesti.loading} />
        {biznisVesti.error && (
          <p className={styles.errorMsg}>Greška pri učitavanju.</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Posao oglasi</h2>
          <Link to="/?category=2855" className={styles.seeAll}>
            Pogledaj sve →
          </Link>
        </div>
        <SectionGrid posts={posaoOglasi.posts} loading={posaoOglasi.loading} />
        {posaoOglasi.error && (
          <p className={styles.errorMsg}>Greška pri učitavanju.</p>
        )}
      </section>
    </div>
  );
};

export default Directory;
