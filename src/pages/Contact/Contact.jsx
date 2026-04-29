import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./Contact.module.scss";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Kontakt</h1>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label>Ime:</label>
          <input type="text" name="from_name" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="reply_to" required />
        </div>
        <div>
          <label>Poruka:</label>
          <textarea name="message" rows={5} required />
        </div>

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Šaljem..." : "Pošalji"}
        </button>
      </form>

      {status === "success" && (
        <p className={styles.success}> Poruka je uspešno poslata!</p>
      )}
      {status === "error" && (
        <p className={styles.error}> Greška pri slanju. Pokušaj ponovo.</p>
      )}
    </div>
  );
};

export default Contact;
