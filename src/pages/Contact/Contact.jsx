import React, { useState } from "react";
import styles from "./Contact.module.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Poslat formular:", formData);
    alert("Hvala! Poruka je poslata.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.container}>
      <h1>Kontakt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ime:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Poruka:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Pošalji</button>
      </form>
    </div>
  );
};

export default Contact;
