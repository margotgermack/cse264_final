import { useState } from "react";

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;

    const reviewData = {
      rating: Number(rating),
      difficulty: Number(difficulty),
      body,
    };

    if (onSubmit) {
      onSubmit(reviewData);
    }

    setBody("");
    setRating(5);
    setDifficulty(3);
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
        Rating (1–5){" "}
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <br />

      <label>
        Difficulty (1–5){" "}
        <input
          type="number"
          min="1"
          max="5"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
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

      <button type="submit" style={{ marginTop: "0.5rem" }}>
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;