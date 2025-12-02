import { useState } from "react";
import { updateRating, createComment } from "../api.js";

function ReviewForm({ courseId, ratingId, currentRatings, onSubmit, currentUser }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;

    const reviewData = {
      rating: Number(rating),
      body,
    };

    const commentData = {
      created_by: currentUser, // or id
      body: body,
    };

  
    const numericRating = Number(rating);

    const updatedRatings = {
      one_star: Number(currentRatings.one_star) + (numericRating === 1 ? 1 : 0),
      two_stars: Number(currentRatings.two_stars) + (numericRating === 2 ? 1 : 0),
      three_stars: Number(currentRatings.three_stars) + (numericRating === 3 ? 1 : 0),
      four_stars: Number(currentRatings.four_stars) + (numericRating === 4 ? 1 : 0),
      five_stars: Number(currentRatings.five_stars) + (numericRating === 5 ? 1 : 0),
    };

    console.log("sending ratings →", updatedRatings);
    console.log("courseid: ", courseId, "ratingid: ", ratingId)


    try {
      try {
        await createComment(courseId, commentData); // sends a JSON object
        setBody(""); // reset
      } catch (err) {
        console.error(err);
        alert("Failed to submit comment");
      }
      await updateRating(courseId, ratingId, updatedRatings);
      alert("Review Submitted!");
      
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1.5rem",
        borderTop: "1px solid #ddd",
        paddingTop: "1rem",
      }}
    >
      <h3>Leave a Review</h3>

      <label>
        Difficulty (1-5){" "}
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <br />
        <label>
          like/dislike
          <input 
          type="checkbox"
          min="1"
          max="2"
          />
        </label>
      <br />

      <label>
        Comment
        <br />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: "0.25rem" }}
          placeholder="Share your experience with this course…"
        />
      </label>

      <br />

      <button type="submit" style={{ marginTop: "0.5rem", marginBottom: "5rem"}}>
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;