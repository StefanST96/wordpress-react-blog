import { API_BASE_URL } from "./api";

// Fetch the "About Us" page from WordPress by slug
export const fetchAboutPage = async () => {
  const res = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages?slug=o-nama`);

  const data = await res.json();
  return data?.[0] || null;
};

// Fetch the "banner" custom field from WordPress
export const fetchBannerImage = async () => {
  return `${API_BASE_URL}/wp-content/uploads/2026/03/posao-beograd.png`;
};
