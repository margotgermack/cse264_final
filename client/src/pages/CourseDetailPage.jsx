
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCourse,
  createCourseRating,
  getCourseRating,
  getCourseComments,
  getCourseLike,
} from "../api.js";


import { useAuth } from "../AuthContext.jsx";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";



function CourseDetailPage() {
  // get course id from URL
  const { id } = useParams();
  // global auth info: determines if admin/user logged in
  const { user } = useAuth();

  // local components state
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(null);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");

  // Load course details
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoadingCourse(true);
        setError("");
        const [courseData, ratingsData, likesData, commentsData] = await Promise.all([
          getCourse(id),
          getCourseRating(id),
          getCourseLike(id),
          getCourseComments(id),
        ]);

        setCourse(courseData);
        setRatings(ratingsData[0]); 
        setLikes(likesData[0])
        setComments(commentsData);

      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoadingCourse(false);
      }
    }
    loadCourse();
  }, [id]);
  

  // load ratings when course changes
  useEffect(() => {
    async function loadRatings() {
      try {
        setLoadingRatings(true);
        const data = await getCourseRating(id);
        setRatings(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRatings(false);
      }
    }
    loadRatings();
  }, [id]);

  useEffect(() => {
    async function loadLikes() {
      try {
        setLoadingLikes(true);
        const data = await getCourseLike(id);
        setLikes(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLikes(false);
      }
    }
    loadLikes();
  }, [id]);

  async function handleAddReview() {
    try {
      const [updatedRatings, updatedLikes, updatedComments] = await Promise.all([
        getCourseRating(id),
        getCourseLike(id),
        getCourseComments(id),
      ]);
      setRatings(updatedRatings[0]);
      setLikes(updatedLikes[0]);
      setComments(updatedComments);
    } catch (err) {
      console.error(err);
      alert("Failed to refresh reviews.");
    }
  }

  async function handleAddRating() {
    try {
      const updated = await getCourseRating(id);
      setRatings(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
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
        mt: '64px',
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

      {loadingRatings ? (
        <CircularProgress />
      ) : (
        <ReviewList ratings={ratings} likes={likes} comments={comments}/>
      )}

      <Box sx={{ mt: 3 }}>
        {user ? (
          <>
            {loadingRatings ? (
              <CircularProgress />
                ) : (
                  <ReviewForm
                    courseId={id}
                    ratingId={ratings?.id}    // now correct
                    currentRatings={ratings}
                    onSubmit={handleAddReview}
                    currentUser={user.username}
                    likeId={(likes?.id)}
                    currentLikes={likes}
                  />
                )}
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
