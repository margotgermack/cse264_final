// GLOBAL WRAPPER AND ROUTING

import { Routes, Route } from "react-router-dom";

// pages
import HomePage from "./pages/HomePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// components
import Navbar from "./components/Navbar.jsx";

import Container from "@mui/material/Container";

function App() {
  return (
    <>
      <Navbar />

      {/* GLOBAL CENTERED WRAPPER FOR ALL PAGES */}
      <Container
        maxWidth="md"
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
