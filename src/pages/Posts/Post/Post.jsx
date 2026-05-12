import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader/Loader";
import { Button } from "../../../components/UI/Button/Button";
import { usePost } from "../../../hooks/usePost";
import { getMediaByIds } from "../../../api/posts";
import styles from "./Post.module.scss";
import { ArrowLeft } from "lucide-react";

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
   MAIN COMPONENT
---------------------------- */
const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { post, loading, error } = usePost(id);

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
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
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

        {keywords.length > 0 && (
          <div className={styles.keywords}>
            {keywords.map((kw) => (
              <span key={kw} className={styles.keyword}>
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
