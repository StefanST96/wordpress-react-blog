import { getData } from "../services/request";

const DEFAULT_POST_PARAMS = {
  _embed: 1,
  per_page: 14,
  orderby: "date",
  order: "desc",
};

const buildPostsUrl = (customParams = {}) => {
  const params = new URLSearchParams({
    ...DEFAULT_POST_PARAMS,
    ...customParams,
  });

  return `/posts?${params.toString()}`;
};

// ======================
// POSTS BY TYPE
// ======================

// 📰 Biznis vesti
export const getBiznisVesti = (page = 1) =>
  getData(
    buildPostsUrl({
      page,
      categories: 2857,
    }),
  );

// 💼 Posao oglasi
export const getPosaoOglasi = (page = 1) =>
  getData(
    buildPostsUrl({
      page,
      categories: 2855,
    }),
  );

// 📦 Ostalo
export const getOstaloPosts = (page = 1) =>
  getData(
    buildPostsUrl({
      page,
      categories_exclude: "10,11",
    }),
  );

// ======================
// GENERIC
// ======================

export const getPosts = (page = 1) => getData(buildPostsUrl({ page }));

export const getFilteredPosts = ({
  page = 1,
  category,
  city,
  search = "",
  perPage = 12,
}) => {
  const params = {
    page,
    per_page: perPage,
  };

  if (category && category !== "all") {
    params.categories = category;
  }

  if (city && city !== "all") {
    params.gradovi = city;
  }

  if (search.trim()) {
    params.search = search;
  }

  return getData(buildPostsUrl(params));
};

// ======================
// SINGLE / EXTRA
// ======================

export const getPost = (id) => getData(`/posts/${id}?_embed`);

export const getCities = () => getData("/gradovi?per_page=100");

export const getCategories = () => getData("/categories?per_page=100");

export const getLatestPosts = () => getData(buildPostsUrl({ per_page: 3 }));

export const getMediaByIds = (ids = []) =>
  getData(`/media?include=${ids.join(",")}&per_page=100`);
