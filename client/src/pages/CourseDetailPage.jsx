import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourse,
  getCourseRating,
  deleteCourse,
} from "../api.js";

import { useAuth } from "../AuthContext.jsx";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // admin if type === "admin" OR role === "admin"
  const isAdmin = user?.type === "admin" || user?.role === "admin";

  const [course, setCourse] = useState(null);
  const [ratings, setRatings] = useState(null);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [error, setError] = useState("");

  // Load course information
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoadingCourse(true);
        setError("");
        const data = await getCourse(id);
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoadingCourse(false);
      }
    }
    loadCourse();
  }, [id]);

  // Load course ratings summary
  useEffect(() => {
    async function loadRatings() {
      try {
        setLoadingRatings(true);
        const data = await getCourseRating(id);
        setRatings(data?.[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRatings(false);
      }
    }
    loadRatings();
  }, [id]);

  // After a user submits a review, reload updated rating summary
  async function refreshRatings() {
    try {
      const updated = await getCourseRating(id);
      setRatings(updated?.[0] || null);
    } catch (err) {
      console.error(err);
    }
  }

  // Admin-only delete course
  async function handleDeleteCourse() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course permanently?"
    );
    if (!confirmed) return;

    try {
      await deleteCourse(id);
      navigate("/"); // send back to home page
    } catch (err) {
      console.error(err);
      alert("Failed to delete the course.");
    }
  }

  // 🌟 LOADING STATE
  if (loadingCourse) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return <Typography>Course not found.</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        mx: "auto",
      }}
    >
      {/* COURSE HEADER */}
      <Typography variant="h4" gutterBottom>
        {course.code}: {course.name}
      </Typography>

      {course.description && (
        <Typography sx={{ mb: 3 }}>{course.description}</Typography>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Admin Tools
          </Typography>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDeleteCourse}
            sx={{ textTransform: "none" }}
          >
            Delete Course
          </Button>
        </Box>
      )}

      {/* REVIEWS SECTION */}
      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>

      {loadingRatings ? (
        <CircularProgress />
      ) : (
        <ReviewList ratings={ratings} />
      )}

      {/* SUBMIT REVIEW (IF LOGGED IN) */}
      <Box sx={{ mt: 3 }}>
        {user ? (
          loadingRatings ? (
            <CircularProgress />
          ) : (
            <ReviewForm
              courseId={id}
              ratingId={ratings?.id}
              currentRatings={ratings}
              onReviewSubmit={refreshRatings}
            />
          )
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            You must be logged in to leave a review.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CourseDetailPage;
