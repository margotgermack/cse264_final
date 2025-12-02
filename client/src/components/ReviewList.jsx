function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet. Be the first to review this course!</p>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            border: "1px solid #eee",
            borderRadius: "6px",
            padding: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <p style={{ marginBottom: "0.25rem" }}>
            <strong>Rating:</strong> {review.rating}/5 &nbsp;|&nbsp;
            <strong>Difficulty:</strong> {review.difficulty}/5
          </p>
          <p style={{ marginTop: 0 }}>{review.body}</p>
          <small style={{ color: "#666" }}>
            by {review.userName ?? "Anonymous"}
          </small>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
