import { API_BASE_URL } from "./api";

export const getSiteSettings = async () => {
  const res = await fetch(`${API_BASE_URL}/wp-json`);
  return await res.json();
};
