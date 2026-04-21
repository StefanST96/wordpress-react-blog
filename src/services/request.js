import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/wp-json/wp/v2`,
});

export const getData = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};