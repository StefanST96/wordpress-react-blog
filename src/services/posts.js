import { getData } from "./request";

export const getPosts = (page = 1) =>
  getData(`/posts?_embed&page=${page}&per_page=6`);

export const getPost = (id) =>
  getData(`/posts/${id}?_embed`);