import { useState } from "react";
import { updateRating, updateLikes, createComment } from "../api.js";

function ReviewForm({ courseId, ratingId, currentRatings, onSubmit, currentUser, likeId, currentLikes }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [like, setLike] = useState(0);

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

    console.log("currentRatings:", currentRatings);
    console.log("currentLikes:", currentLikes);
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


    // Update like/dislike count
    const updatedLikes = {
      likes: Number(currentLikes.likes) + (like === 1 ? 1 : 0),
      dislikes: Number(currentLikes.dislikes) + (like === 0 ? 1 : 0),
    };

    console.log("sending likes →", updatedLikes);


    try {
      try {
        await createComment(courseId, commentData); // sends a JSON object
        setBody(""); // reset
      } catch (err) {
        console.error(err);
        alert("Failed to submit comment");
      }
      await updateRating(courseId, ratingId, updatedRatings);
      await updateLikes(courseId, likeId, updatedLikes)
      alert("Review Submitted!");
      
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }

    if (onSubmit) onSubmit();
    setLike(0);
    setRating(5)
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
        
         {/* Thumbs up */}
          <button
            type="button"
            onClick={() => setLike(1)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: like === 1 ? "#9cf4a0ff" : "#000000ff",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            👍
          </button>

          {/* Thumbs down */}
          <button
            type="button"
            onClick={() => setLike(0)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: like === 0 ? "#ff7a85ff" : "#000000ff",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            👎
          </button>
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