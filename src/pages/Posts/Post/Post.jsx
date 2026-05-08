import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader/Loader";
import { Button } from "../../../components/UI/Button/Button";
import { usePost } from "../../../hooks/usePost";
import { getMediaByIds } from "../../../api/posts";
import styles from "./Post.module.scss";
import { ArrowLeft } from "lucide-react";

// Dekoduje HTML entitete (&#8220; &#8221; &#8243; itd. → ")
const decodeHtmlEntities = (str = "") =>
  str
    .replace(/&#8220;|&#8221;|&#8222;|&#8243;|&quot;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&amp;/g, "&");

// Izvlači sve [vc_media_grid include="id1,id2,..."] shortcodes
const extractMediaGridIds = (html = "") => {
  const decoded = decodeHtmlEntities(html);
  const regex = /\[vc_media_grid[^\]]*include="([\d,]+)"/g;
  const allIds = [];
  let match;
  while ((match = regex.exec(decoded)) !== null) {
    match[1].split(",").forEach((id) => allIds.push(Number(id.trim())));
  }
  return allIds;
};

// Uklanja shortcodes ali ostavlja mesto za galeriju (marker)
const processContent = (html = "") => {
  const decoded = decodeHtmlEntities(html);
  // Zameni vc_media_grid sa markerom
  let processed = decoded.replace(
    /\[vc_media_grid[^\]]*\]/g,
    '<div class="__media-grid-placeholder"></div>',
  );
  // Ukloni sve ostale shortcodes
  processed = processed.replace(/\[\/?\w[\w-]*(?:\s[^\]]*?)?\]/g, "");
  return processed;
};

const MediaGrid = ({ ids }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) return;
    getMediaByIds(ids)
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p style={{ fontSize: 14, color: "#888" }}>Učitavanje galerije...</p>
    );
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

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { post, loading, error } = usePost(id);

  if (loading) return <Loader />;
  if (error || !post) return <p>Post nije pronađen.</p>;

  const rawContent = post.content.rendered;
  const mediaIds = extractMediaGridIds(rawContent);
  const cleanContent = processContent(rawContent);

  // Razdvoji sadržaj na delove oko placeholder-a
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

      {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
        <img
          className={styles.image}
          src={post._embedded["wp:featuredmedia"][0].source_url}
          alt={post.title.rendered}
        />
      )}

      <div className={styles.content}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <div dangerouslySetInnerHTML={{ __html: part }} />
            {i < parts.length - 1 && mediaIds.length > 0 && (
              <MediaGrid ids={mediaIds} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Post;
