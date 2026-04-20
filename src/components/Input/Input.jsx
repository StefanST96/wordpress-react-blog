import styles from "./Input.module.scss";

const Input = ({
  value,
  onChange,
  small,
  label,
  placeholder,
  customClass,
  type,
}) => {
  const renderLabel = () => {
    if (!label) return null;
    return <label className={styles.inputLabel}>{label}</label>;
  };

  return (
    <section className={`${styles.input} ${small ? styles.small : ""}`}>
      {renderLabel()}

      <input
        className={`${styles.inputField} ${customClass || ""}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
};

export { Input };
