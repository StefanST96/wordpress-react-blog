import axios from "axios";
import { API_BASE_URL } from "../api/api";

if (!API_BASE_URL) {
  console.warn("VITE_SERVER_URL is missing in environment variables");
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/wp-json/wp/v2`,
});

export const getData = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (err) {
    // 400 = nema više stranica, tiho ignoriši
    if (err?.response?.status !== 400) {
      console.error("API error:", err);
    }
    throw err;
  }
};
