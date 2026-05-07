import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader/Loader";
import { Button } from "../../../components/UI/Button/Button";
import { usePost } from "../../../hooks/usePost";
import styles from "./Post.module.scss";
import { ArrowLeft } from "lucide-react";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { post, loading, error } = usePost(id);

  if (loading) return <Loader />;
  if (error || !post) return <p>Post nije pronađen.</p>;

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

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
};

export default Post;
