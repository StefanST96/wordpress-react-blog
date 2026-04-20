export async function fetchPosts() {
  const res = await fetch(
    "https://naissus.info/wp-json/wp/v2/posts"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}