import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Posts from "../pages/Posts/Posts";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Post from "../pages/Posts/Post/Post";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
};

export default AppRoutes;
