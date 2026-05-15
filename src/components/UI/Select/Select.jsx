import styles from "./Select.module.scss";
import { useEffect, useRef, useState } from "react";

const Select = ({
  disabled,
  onChange,
  options = [],
  label,
  placeholder,
  customClass,
  value,
  marginNone,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const dropDownToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const valueChange = (option, e) => {
    e.stopPropagation(); // 🔥 sprečava re-toggle
    onChange(option.value);
    setOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  // 🔥 zatvaranje na klik van komponente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section ref={ref} className={styles.select}>
      {label && <label className={styles.selectLabel}>{label}</label>}

      <section
        className={`${styles.selectField} ${
          marginNone ? styles.marginNone : ""
        } ${customClass || ""} ${disabled ? styles.disabled : ""}`}
        onClick={dropDownToggle}
      >
        {selectedOption ? selectedOption.label : (placeholder || (options[0]?.label ?? ""))}

        {open && (
          <ul className={styles.options}>
            {options.map((option) => (
              <li
                key={option.id}
                onClick={(e) => valueChange(option, e)}
                className={option.value === value ? styles.active : ""}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export { Select };
