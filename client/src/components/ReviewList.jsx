function ReviewList({ ratings }) {
  if (!ratings) {
    return <p>No ratings yet. Be the first to rate this course!</p>;
  }

  const totalVotes =
  Number(ratings.one_star) +
  Number(ratings.two_stars) +
  Number(ratings.three_stars) +
  Number(ratings.four_stars) +
  Number(ratings.five_stars);

  const average =
    totalVotes === 0
      ? 0
      : (
          (Number(ratings.one_star) * 1 +
            Number(ratings.two_stars) * 2 +
            Number(ratings.three_stars) * 3 +
            Number(ratings.four_stars) * 4 +
            Number(ratings.five_stars )* 5) /
          totalVotes
        ).toFixed(2);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "6px",
          padding: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        <p><strong>Average Difficulty:</strong> {average} / 5 ⭐ ({totalVotes} votes)</p>

      </div>

      
    </div>
  );
}

export default ReviewList;
