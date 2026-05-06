import { getData } from "../services/request";

const DEFAULT_POST_PARAMS = {
  _embed: true,
  per_page: 6,
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

export const getPosts = (page = 1) => getData(buildPostsUrl({ page }));

export const getFilteredPosts = ({ page = 1, category, city, perPage = 6 }) => {
  const params = {
    page,
    per_page: perPage,
  };

  if (category) params.categories = category;
  if (city) params.gradovi = city;

  return getData(buildPostsUrl(params));
};

export const getPost = (id) => getData(`/posts/${id}?_embed`);

export const getCities = () => getData("/gradovi?per_page=100");

export const getCategories = () => getData("/categories?per_page=100");

export const getLatestPosts = () => getData(buildPostsUrl({ per_page: 3 }));
