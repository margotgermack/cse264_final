import { useEffect, useState } from "react";
import { getCourses, createCourse } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";
import { useAuth } from "../AuthContext.jsx";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";


function HomePage() {
  const { user } = useAuth();
  const isAdmin = user?.type === "admin" || user?.role === "admin";

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // admin form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleCreateCourse(e) {
    e.preventDefault();
    if (!newCode || !newName || !newDescription) return;

    try {
      setSavingCourse(true);
      setSaveError("");
      const created = await createCourse({
        code: newCode,
        name: newName,
        description: newDescription,
      });

      // API returns { message, application: <course> }
      const course = created.application || created;

      setCourses((prev) => [...prev, course]);
      setNewCode("");
      setNewName("");
      setNewDescription("");
    } catch (err) {
      console.error(err);
      setSaveError("Failed to create course.");
    } finally {
      setSavingCourse(false);
    }
  }


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
    <Box  sx={{ mt: '64px', px: 2 }}>
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

            {/* Admin-only add course form */}
      {isAdmin && (
        <Box
          component="form"
          onSubmit={handleCreateCourse}
          sx={{
            mt: 3,
            mb: 4,
            p: 2,
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Typography variant="subtitle1">Admin: Add a new course</Typography>
          
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Code"
              size="small"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              sx={{ width: "20%" }}
              required
            />
            <TextField
              label="Name"
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ flex: 1 }}
              required
            />
          </Box>

          <TextField
            label="Description"
            size="small"
            multiline
            minRows={2}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />

          {saveError && (
            <Typography variant="body2" color="error">
              {saveError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={savingCourse}
            sx={{ alignSelf: "flex-end", textTransform: "none" }}
          >
            {savingCourse ? "Saving…" : "Create course"}
          </Button>
        </Box>
      )}


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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 , marginBottom: "5rem"}}>
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
