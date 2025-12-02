import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCourse,
  getCourseReviews,
  createCourseReview,
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
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");

  // Load course details
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

  // Load reviews
  useEffect(() => {
    async function loadReviews() {
      try {
        setLoadingReviews(true);
        const data = await getCourseReviews(id);
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [id]);

  async function handleAddReview(reviewData) {
    try {
      const created = await createCourseReview(id, reviewData);
      setReviews((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Try again.");
    }
  }

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
      <Typography variant="h4" gutterBottom>
        {course.code}: {course.name}
      </Typography>

      {course.description && (
        <Typography sx={{ mb: 3 }}>{course.description}</Typography>
      )}

      {/* Admin-only area */}
      {user?.role === "admin" && (
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
            Admin tools
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled
            sx={{ textTransform: "none" }}
          >
            Edit course (coming soon)
          </Button>
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>

      {loadingReviews ? (
        <CircularProgress />
      ) : (
        <ReviewList reviews={reviews} />
      )}

      <Box sx={{ mt: 3 }}>
        {user ? (
          <>
            <Typography variant="h6" gutterBottom>
              Leave a Review
            </Typography>
            <ReviewForm onSubmit={handleAddReview} />
          </>
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
