import React, { useEffect, useState } from "react";
import styles from "./About.module.scss";
import { fetchAboutPage } from "../../api/wp";

const cleanWPContent = (html) => {
  if (!html) return "";

  return (
    html
      // WPBakery shortcodes
      .replace(/\[vc_[^\]]*\]/g, "")
      .replace(/\[\/vc_[^\]]*\]/g, "")

      // sidebar + widgets
      .replace(/<aside[\s\S]*?<\/aside>/g, "")
      .replace(/<div[^>]*widget[^>]*>[\s\S]*?<\/div>/g, "")
      .replace(/class="[^"]*sidebar[^"]*"/g, "")
      .replace(/id="[^"]*sidebar[^"]*"/g, "")

      // fallback cleanup
      .replace(/\[\/?vc_[^\]]*\]/g, "")
  );
};

const About = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await fetchAboutPage();
        setPage(data);
      } catch (err) {
        console.error("About page error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  if (loading) {
    return <div className={styles.wrapper}>Loading...</div>;
  }

  if (!page) {
    return <div className={styles.wrapper}>Page not found</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{page.title.rendered}</h1>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: cleanWPContent(page.content.rendered),
        }}
      />
    </div>
  );
};

export default About;
