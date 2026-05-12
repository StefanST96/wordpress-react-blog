import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.scss";
import { MapPin } from "lucide-react";

const PostCard = ({ post, onCategoryClick }) => {
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/fallback.svg";

  const cities = post._embedded?.["wp:term"]?.[2] || [];
  const categories = post._embedded?.["wp:term"]?.[0] || [];

  return (
    <Link to={`/post/${post.id}`} className={styles.card}>
      <div className={styles.content}>
        <img src={image} alt="" className={styles.image} />
        <h4
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* <p className={styles.excerpt}>
          {post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 140)}
          ...
        </p> */}

        {/* <div className={styles.metaBottom}>
          <span className={styles.date}>
            {new Date(post.date).toLocaleDateString("sr-RS", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div> */}

        <div className={styles.cities}>
          {cities.length > 0 && (
            <span className={styles.city}>
              <MapPin size={14} /> {cities[0].name}
            </span>
          )}
        </div>

        <div className={styles.metaTop}>
          {categories.length > 0 && (
            <span
              className={styles.category}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const lastCategory = categories[categories.length - 1];

                onCategoryClick(lastCategory.id);
              }}
            >
              {categories[categories.length - 1].name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.shape({
      rendered: PropTypes.string.isRequired,
    }).isRequired,
    excerpt: PropTypes.shape({
      rendered: PropTypes.string.isRequired,
    }).isRequired,
    _embedded: PropTypes.shape({
      "wp:featuredmedia": PropTypes.arrayOf(
        PropTypes.shape({
          source_url: PropTypes.string,
        }),
      ),
      "wp:term": PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
          }),
        ),
      ),
    }),
  }).isRequired,
  onCategoryClick: PropTypes.func.isRequired,
};

export default PostCard;
