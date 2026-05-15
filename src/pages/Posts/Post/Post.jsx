import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------------------
   OG META TAG HELPER
---------------------------- */
const setMetaTag = (property, content) => {
  if (!content) return;
  let el =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(
      property.startsWith("og:") || property.startsWith("twitter:")
        ? "property"
        : "name",
      property,
    );
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setPostMeta = (post) => {
  const title = decodeHtmlEntities(
    post.title?.rendered?.replace(/<[^>]+>/g, "") || "",
  );
  const description =
    post.excerpt?.rendered
      ?.replace(/<[^>]+>/g, "")
      .trim()
      .slice(0, 200) || "";
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
  const url = window.location.href;

  document.title = title;

  setMetaTag("og:title", title);
  setMetaTag("og:description", description);
  setMetaTag("og:image", image);
  setMetaTag("og:url", url);
  setMetaTag("og:type", "article");

  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", title);
  setMetaTag("twitter:description", description);
  setMetaTag("twitter:image", image);
};

const resetMeta = () => {
  document.title = "Biznis Klub";
  [
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "og:type",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ].forEach((prop) => {
    const el =
      document.querySelector(`meta[property="${prop}"]`) ||
      document.querySelector(`meta[name="${prop}"]`);
    if (el) el.remove();
  });
};
import Loader from "../../../components/UI/Loader/Loader";
import { Button } from "../../../components/UI/Button/Button";
import { usePost } from "../../../hooks/usePost";
import { getMediaByIds, getRelatedPosts } from "../../../api/posts";
import styles from "./Post.module.scss";
import { ArrowLeft, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import PostCardSkeleton from "../../../components/UI/Skeleton/PostCardSkeleton";

/* ---------------------------
   HTML decode
---------------------------- */
const decodeHtmlEntities = (str = "") =>
  str
    .replace(/&#8220;|&#8221;|&#8222;|&#8243;|&quot;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&amp;/g, "&");

/* ---------------------------
   MEDIA GRID IDS
---------------------------- */
const extractMediaGridIds = (html = "") => {
  const decoded = decodeHtmlEntities(html);
  const regex = /\[vc_media_grid[^\]]*include="([\d,]+)"/g;
  const ids = [];
  let match;
  while ((match = regex.exec(decoded)) !== null) {
    match[1].split(",").forEach((id) => ids.push(Number(id.trim())));
  }
  return ids;
};

/* ---------------------------
   GOOGLE MAP EXTRACTION
---------------------------- */
const extractMapIframe = (html = "") => {
  const decoded = decodeHtmlEntities(html);
  const match = decoded.match(/\[vc_gmaps[^\]]*link="#E-8_([A-Za-z0-9+/=]+)"/);
  if (!match) return null;
  try {
    const iframeHtml = decodeURIComponent(atob(match[1]));
    const src = iframeHtml.match(/src="([^"]+)"/);
    return src ? src[1] : null;
  } catch {
    return null;
  }
};
/* ---------------------------
   KEYWORDS FROM YOAST
---------------------------- */
const extractKeywords = (post) => {
  try {
    const graph = post?.yoast_head_json?.schema?.["@graph"] ?? [];
    const article = graph.find((n) => n["@type"] === "Article");
    return article?.keywords ?? [];
  } catch {
    return [];
  }
};

/* ---------------------------
   CLEAN CONTENT
---------------------------- */
const processContent = (html = "") => {
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(
      /\[vc_media_grid[^\]]*\]/g,
      '<div class="__media-grid-placeholder"></div>',
    )
    .replace(/\[vc_gmaps[^\]]*\]/g, "")
    .replace(/\[\/*[^\]]+\]/g, "");
};

/* ---------------------------
   MEDIA GRID
---------------------------- */
const MediaGrid = ({ ids }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) return;
    getMediaByIds(ids)
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

  if (loading) return <p>Učitavanje galerije...</p>;
  if (!images.length) return null;

  return (
    <div className={styles.mediaGrid}>
      {images.map((img) => (
        <a key={img.id} href={img.source_url} target="_blank" rel="noreferrer">
          <img
            src={img.media_details?.sizes?.medium?.source_url || img.source_url}
            alt={img.alt_text || ""}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
};

/* ---------------------------
   RELATED POSTS
---------------------------- */
const RelatedPosts = ({ postId, tags, categories }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    getRelatedPosts(postId, tags, categories)
      .then((data) => setRelated(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  if (!loading && related.length === 0) return null;

  return (
    <div className={styles.relatedSection}>
      <h2 className={styles.relatedTitle}>Povezani postovi</h2>
      <div className={styles.relatedGrid}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : related.map((post) => (
              <PostCard key={post.id} post={post} onCategoryClick={() => {}} />
            ))}
      </div>
    </div>
  );
};

/* ---------------------------
   MAIN COMPONENT
---------------------------- */
const Post = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { post, loading, error } = usePost(slug);

  useEffect(() => {
    if (post) setPostMeta(post);
    return () => resetMeta();
  }, [post]);

  if (loading) return <Loader />;
  if (error || !post) return <p>Post nije pronađen.</p>;

  const rawContent = post.content.rendered;

  const mediaIds = extractMediaGridIds(rawContent);
  const mapSrc = extractMapIframe(rawContent);
  const keywords = extractKeywords(post);
  const cleanContent = processContent(rawContent);
  const parts = cleanContent.split(
    '<div class="__media-grid-placeholder"></div>',
  );

  // tags and categories for related posts
  const postTags = post.tags || [];
  const postCategories = post.categories || [];

  // Extract tag slugs from _embedded wp:term[1]
  const embeddedTags = post._embedded?.["wp:term"]?.[1] || [];

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

      <h1
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: decodeHtmlEntities(post.title.rendered),
        }}
      />

      <div className={styles.content}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <div dangerouslySetInnerHTML={{ __html: part }} />
            {i < parts.length - 1 && mediaIds.length > 0 && (
              <MediaGrid ids={mediaIds} />
            )}
          </React.Fragment>
        ))}

        {mapSrc && (
          <div className={styles.map}>
            <iframe
              src={mapSrc}
              width="100%"
              height="400"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        )}

        {/* KEYWORDS / TAGS */}
        {(keywords.length > 0 || embeddedTags.length > 0) && (
          <div className={styles.keywords}>
            <Tag size={15} className={styles.tagIcon} />
            {embeddedTags.length > 0
              ? embeddedTags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className={styles.keyword}
                  >
                    {tag.name}
                  </Link>
                ))
              : keywords.map((kw) => (
                  <span key={kw} className={styles.keyword}>
                    {kw}
                  </span>
                ))}
          </div>
        )}
      </div>

      {/* RELATED POSTS */}
      <RelatedPosts
        postId={post.id}
        tags={postTags}
        categories={postCategories}
      />
    </div>
  );
};

export default Post;
