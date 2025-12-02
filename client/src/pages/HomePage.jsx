import { useEffect, useState } from "react";
import { getCourses } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError("");
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses. Try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const term = search.toLowerCase();
    const name = (course.name || "").toLowerCase();
    const code = (course.code || "").toLowerCase();
    const description = (course.description || "").toLowerCase();

    return (
      name.includes(term) ||
      code.includes(term) ||
      description.includes(term)
    );
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Browse Courses
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, code, or description…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {filteredCourses.length === 0 && (
            <Typography sx={{ mt: 2 }}>No courses found.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default HomePage;
