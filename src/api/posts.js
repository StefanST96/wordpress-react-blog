import { getData } from "../services/request";

export const getPosts = (page = 1) =>
  getData(`/posts?_embed&page=${page}&per_page=6&orderby=date&order=desc`);

export const getPost = (id) => getData(`/posts/${id}?_embed`);

export const getCategories = () => getData("/categories?per_page=100");

export const getPostsByCategory = (catId, page = 1) =>
  getData(
    `/posts?_embed&categories=${catId}&page=${page}&per_page=6&orderby=date&order=desc`,
  );

export const getLatestPosts = () =>
  getData("/posts?_embed&per_page=3&orderby=date&order=desc");
