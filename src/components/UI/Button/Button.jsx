import PropTypes from "prop-types";
import styles from "./Button.module.scss";

const Button = ({
  success,
  warning,
  danger,
  small,
  search,
  disabled,
  onClick,
  title,
  dark,
  pageButton,
  navButton,
  active,
}) => {
  const classes = `${success ? styles.success : ""} ${warning ? styles.warning : ""} ${danger ? styles.danger : ""} ${small ? styles.small : ""}${search ? styles.search : ""} ${dark ? styles.dark : ""} ${pageButton ? styles.pageButton : ""} ${navButton ? styles.navButton : ""} ${active ? styles.active : ""} 
  `;

  return (
    <button
      className={`${styles.button} ${classes}`}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  success: PropTypes.bool,
  warning: PropTypes.bool,
  danger: PropTypes.bool,
  small: PropTypes.bool,
  search: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  dark: PropTypes.bool,
  pageButton: PropTypes.bool,
  navButton: PropTypes.bool,
  active: PropTypes.bool,
};

export { Button };
