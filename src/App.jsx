import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Footer from "./components/Layout/Footer/Footer.jsx";
import { getSiteSettings } from "./api/site";
import { siteCache } from "./cache/siteCache";

function App() {
  const cached = siteCache.get();

  const [site, setSite] = useState(cached || { name: "", logo: "" });

  useEffect(() => {
    const fetchSite = async () => {
      const data = await getSiteSettings();

      const formatted = {
        name: data?.name || "",
        logo: data?.site_icon_url || "",
      };

      setSite(formatted);
      siteCache.set(formatted);
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
