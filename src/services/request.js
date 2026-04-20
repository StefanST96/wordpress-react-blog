import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/wordpress-react/wp-json/wp/v2",
  headers: { "Content-Type": "application/json" },
});

const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Greška pri fetch-u:", error.message);
    return null;
  }
};

export { getData };
