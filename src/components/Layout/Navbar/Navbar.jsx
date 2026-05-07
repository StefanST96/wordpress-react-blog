import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { Button } from "../../UI/Button/Button.jsx";
import { useSiteSettings } from "../../../hooks/useSiteSettings";
import localLogo from "../../../assets/biznis.png";

const Navbar = () => {
  const { name, logo } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => setOpen(false);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.navbar}`)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Posts active logic (IMPORTANT FIX)
  const isPostsActive =
    location.pathname.startsWith("/posts") ||
    location.pathname.startsWith("/post");

  return (
    <nav className={styles.navbar}>
      <div className={styles.wrapper}>
        {/* LOGO */}
        <NavLink to="/" onClick={closeMenu}>
          <div className={styles.logo}>
            {logo ? (
              <img src={logo} alt="Logo" />
            ) : (
              <img src={localLogo} alt="Fallback Logo" />
            )}
          </div>
        </NavLink>

        {/* HAMBURGER */}
        <div
          className={styles.hamburger}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>

        {/* LINKS */}
        <div className={`${styles.navLinks} ${open ? styles.open : ""}`}>
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Početna
          </NavLink>

          <NavLink
            to="/posts"
            onClick={closeMenu}
            className={() =>
              isPostsActive
                ? `${styles.navLink} ${styles.active}`
                : styles.navLink
            }
          >
            Biznis Adresar
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Biznis Vesti
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Kontakt
          </NavLink>

          <Button
            onClick={toggleTheme}
            title={theme === "light" ? "Dark" : "Light"}
            dark
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
