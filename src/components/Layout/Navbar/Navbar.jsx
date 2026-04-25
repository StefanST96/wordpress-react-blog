import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { Button } from "../../UI/Button/Button.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>My WP Blog</div>
        <div className={styles.navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Posts
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Contact
          </NavLink>

          <Button
            search
            onClick={toggleTheme}
            title={theme === "light" ? "Dark" : "Light"}
            s
          ></Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
