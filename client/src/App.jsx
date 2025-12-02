// GLOBAL WRAPPER AND ROUTING

import { Routes, Route } from "react-router-dom";

// pages
import HomePage from "./pages/HomePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// components
import Navbar from "./components/Navbar.jsx";

import Box from "@mui/material/Box";

function App() {
  return (
    <>
      <Navbar />

      {/* GLOBAL CENTERED WRAPPER FOR ALL PAGES */}
      <Box
        sx={{
          width: "100vw",           // full viewport width
          display: "flex",
          flexDirection: "column",  // stack content vertically
          alignItems: "center",     // center horizontally
          px: 2,
          mt: 0,

        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
