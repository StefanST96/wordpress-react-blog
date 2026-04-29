import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Footer from "./components/Layout/Footer/Footer.jsx";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <AppRoutes />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
