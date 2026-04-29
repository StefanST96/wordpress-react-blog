import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Footer from "./components/Layout/Footer/Footer.jsx";
import { getSiteSettings } from "./api/site";

function App() {
  const [site, setSite] = useState({
    name: "",
    logo: "",
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const data = await getSiteSettings();

        setSite({
          name: data?.name || "",
          logo: data?.site_icon_url || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSite();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Navbar name={site.name} logo={site.logo} />

        <AppRoutes />

        <Footer name={site.name} logo={site.logo} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
