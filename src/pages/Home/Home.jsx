import React from "react";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>Hi, I'm Stefan</h1>
        <p>Frontend Developer (React / WordPress / UI Systems)</p>

        <div className={styles.cta}>
          <a href="https://github.com" target="_blank">
            GitHub
          </a>
          <a href="/contact">Contact</a>
        </div>
      </section>

      {/* SKILLS */}
      <section className={styles.section}>
        <h2>Skills</h2>
        <div className={styles.grid}>
          <span>React</span>
          <span>JavaScript</span>
          <span>WordPress REST API</span>
          <span>SCSS</span>
          <span>UI/UX</span>
        </div>
      </section>

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
