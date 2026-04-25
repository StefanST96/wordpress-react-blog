import { getData } from "../services/request";

export const getPosts = (page = 1) =>
  getData(`/posts?_embed&page=${page}&per_page=6&orderby=date&order=desc`);

export const getPost = (id) => getData(`/posts/${id}?_embed`);
