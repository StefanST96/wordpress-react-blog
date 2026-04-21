import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

if (!BASE_URL) {
  console.warn("VITE_SERVER_URL is missing in environment variables");
}

const api = axios.create({
  baseURL: `${BASE_URL}/wp-json/wp/v2`,
});

export const getData = async (endpoint) => {
  const res = await api.get(endpoint);
  return res.data;
};