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
}) => {
  const classes = `${success ? styles.success : ""} ${warning ? styles.warning : ""} ${danger ? styles.danger : ""} ${small ? styles.small : ""}${search ? styles.search : ""} ${dark ? styles.dark : ""}
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
};

export { Button };
