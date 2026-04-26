import styles from "./Select.module.scss";
import { useState } from "react";

const Select = ({
  disabled,
  onChange,
  options,
  label,
  placeholder,
  customClass,
  value,
  marginNone,
}) => {
  const [open, setOpen] = useState(false);

  const dropDownToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const valueChange = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const renderOptions = () => {
    return (
      <ul className={styles.options}>
        {options.map((option) => (
          <li
            key={option.id}
            onClick={() => valueChange(option)}
            className={option.value === value ? styles.active : ""}
          >
            {option.label}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={styles.select}>
      {label && <label className={styles.selectLabel}>{label}</label>}

      <section
        className={`${styles.selectField} ${styles.marginNone} ${customClass || ""} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={dropDownToggle}
      >
        {selectedOption ? selectedOption.label : placeholder}

        {open && renderOptions()}
      </section>
    </section>
  );
};

export { Select };
