import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { Button } from "../../UI/Button/Button.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>Poftfolio</div>

        {/* MOBILE BUTTON */}
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

        {/* NAV LINKS */}
        <div className={`${styles.navLinks} ${open ? styles.open : ""}`}>
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/posts"
            className={() => {
              const isPosts =
                location.pathname.startsWith("/posts") ||
                location.pathname.startsWith("/post");

              return isPosts
                ? `${styles.navLink} ${styles.active}`
                : styles.navLink;
            }}
          >
            Posts
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Contact
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
