import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
