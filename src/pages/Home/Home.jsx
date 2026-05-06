import React from "react";
import styles from "./Home.module.scss";
import LatestPosts from "../Posts/LatestPosts/LatestPosts.jsx";

const Home = () => {
  React.useEffect(() => {
    const loadBanner = async () => {
      try {
        const image = await fetchBannerImage();
        setBanner(image);
      } catch (err) {
        console.error(err);
      }
    };

    loadBanner();
  }, []);

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>Stefan Taskovic</h1>

        <p>Frontend Developer specializing in React & Headless WordPress.</p>
      </section>

      {/* FEATURED PROJECT */}
      <section className={styles.section}>
        <h2>Featured Project</h2>

        <div className={styles.projectCard}>
          <div className={styles.projectContent}>
            <h3>WordPress React Blog</h3>

            <p>
              Headless blog system built with React + WordPress REST API.
              Includes infinite scroll, category filtering and dark mode.
            </p>

            <div className={styles.tags}>
              <span>React</span>
              <span>WordPress API</span>
              <span>SCSS</span>
            </div>

            <div className={styles.links}>
              <a href="/posts">Live Demo</a>

              <a
                href="https://github.com/StefanST96/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className={styles.section}>
        <h2>Skills</h2>

        <div className={styles.skillsGrid}>
          <div className={styles.skillCard}>
            <h3>Frontend</h3>

            <p>React, JavaScript, HTML, SCSS</p>
          </div>

          <div className={styles.skillCard}>
            <h3>CMS / Backend</h3>

            <p>WordPress REST API, Headless CMS</p>
          </div>

          <div className={styles.skillCard}>
            <h3>Tools</h3>

            <p>Git, Vercel, REST API, Figma</p>
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <LatestPosts />

      {/* PROJECTS */}
      <section className={styles.section}>
        <h2>Projects</h2>

        <div className={styles.projects}>
          <div className={styles.card}>
            <h3>WordPress React Blog</h3>

            <p>Headless blog system with WP REST API + React</p>
          </div>

          <div className={styles.card}>
            <h3>Portfolio App</h3>

            <p>Modern responsive UI with dark mode system</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
