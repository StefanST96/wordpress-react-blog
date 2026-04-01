import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost/wordpress-react/wp-json/wp/v2/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Greška:", error);
      });
  }, []);

  return (
    <div className="container">
      <h1>WordPress + React Blog</h1>

      <div className="posts">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
