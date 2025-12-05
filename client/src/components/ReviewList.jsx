/*
Displays calculated averages, like/dislike counts and all comments
- ratings tab;e, likes table, user comments
*/

function ReviewList({ ratings, likes, comments }) {
  // if missing data, show placeholder text
  if (!ratings || !likes || !comments) {
    return <p>No reviews yet. Be the first to write a review!</p>;
  }

  // sum total number of votes across star categories
  const totalVotes =
  Number(ratings.one_star) +
  Number(ratings.two_stars) +
  Number(ratings.three_stars) +
  Number(ratings.four_stars) +
  Number(ratings.five_stars);

  // compute weighted average difficulty score
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

  // sumerize likes/dislikes
  const totalLikes = Number(likes.likes);
  const totalDislikes = Number(likes.dislikes);

  // ratings summary UI
  const ratingsSection = (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "6px",
        padding: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      <p>
        <strong>Average Difficulty:</strong> {average} / 5 ⭐ ({totalVotes} votes)
        <p><strong>{totalLikes} Likes {totalDislikes} Dislikes</strong></p>
      </p>
    </div>
  );

// Render all comments or fallback
let commentsSection = <p>No comments yet. Be the first to comment!</p>;
if (comments && comments.length > 0) {
  commentsSection = comments.map((c) => (
    <div
      key={c.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
        {c.created_by}
      </p>
      <p>{c.body}</p>
    </div>
  ));
}

return (
  <div style={{ marginTop: "1rem" }}>
    {ratingsSection}
    <div>
      <strong>Comments:</strong>
      {commentsSection}
    </div>
  </div>
);


  
}

export default ReviewList;
