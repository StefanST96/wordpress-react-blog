import { API_BASE_URL } from "./api";

// Fetch the "About Us" page from WordPress by slug
export const fetchAboutPage = async () => {
  const res = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages?slug=o-nama`);

  const data = await res.json();
  return data?.[0] || null;
};
