import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTagBySlug, getPostsByTag } from "../../api/posts";
import PostCard from "../Posts/PostCard/PostCard";
import PostCardSkeleton from "../../components/UI/Skeleton/PostCardSkeleton";
import { Button } from "../../components/UI/Button/Button";
import { ArrowLeft, Tag } from "lucide-react";
import styles from "./TagPosts.module.scss";

const PER_PAGE = 12;

const TagPosts = () => {
  const { tagSlug } = useParams();
  const navigate = useNavigate();

  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Load tag info
  useEffect(() => {
    const fetchTag = async () => {
      try {
        const data = await getTagBySlug(tagSlug);
        if (data) {
          setTag(data);
          document.title = `#${data.name} — Biznis Klub`;
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };
    fetchTag();
    return () => {
      document.title = "Biznis Klub";
    };
  }, [tagSlug]);

  // Load posts when tag is resolved or page changes
  useEffect(() => {
    if (!tag) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPostsByTag(tag.id, page, PER_PAGE);
        const safe = Array.isArray(data) ? data : [];
        setPosts(safe);
        setHasMore(safe.length === PER_PAGE);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag, page]);

  const handleCategoryClick = useCallback(() => {}, []);

  if (error && !tag) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>Tag nije pronađen.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        title={
          <>
            <ArrowLeft size={16} />
            Nazad
          </>
        }
        warning
        small
        onClick={() => navigate(-1)}
      />

      <div className={styles.header}>
        <Tag size={24} className={styles.tagIcon} />
        <h1 className={styles.title}>
          {tag ? tag.name : "Učitavanje..."}
        </h1>
        {tag?.count !== undefined && (
          <span className={styles.count}>{tag.count} postova</span>
        )}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className={styles.grid}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nema postova za ovaj tag.</p>
      )}

      {(posts.length > 0 || page > 1) && (
        <div className={styles.pagination}>
          <Button
            navButton
            title="Prethodna"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          />
          <span className={styles.pageInfo}>Strana {page}</span>
          <Button
            navButton
            title="Sledeća"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
          />
        </div>
      )}

      {error && tag && (
        <p className={styles.empty}>Greška pri učitavanju postova.</p>
      )}
    </div>
  );
};

export default TagPosts;
