import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import { getSiteSettings } from "../../../api/site";
import { useSiteSettings } from "../../../hooks/useSiteSettings";
import localLogo from "../../../assets/biznis.png";

const Footer = () => {
  const { name, logo } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* BRAND */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              {logo ? (
                <img src={logo} alt="Logo" />
              ) : (
                <img src={localLogo} alt="Fallback Logo" />
              )}
            </div>
            <h3>O nama</h3>
            <p className={styles.description}>
              Biznisklub.rs je poslovni portal Srbije, gde možete pronaći
              poslovnog partnera, robu ili uslugu. Kao i informacije o firmama u
              regionu
            </p>
            <p className={styles.description}>
              Kontakt:{" "}
              <a href="mailto:office@biznisklub.rs">office@biznisklub.rs</a>
            </p>
          </div>

          {/* NAVIGATION */}
          {/* <div className={styles.links}>
            <h3>Navigation</h3>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/posts">Posts</Link>
              </li>

              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div> */}

          {/* SOCIAL */}
          {/* <div className={styles.links}> 
             <h3>Follow</h3>

            <ul>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>

              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>

              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className={styles.bottom}>
          <p>
            © {currentYear} {name || "React & WordPress"}. Business media
            consulting.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
