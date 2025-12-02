import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function CourseCard({ course }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {course.code}: {course.name}
        </Typography>
        {course.description && (
          <Typography variant="body1" color="text.secondary">
            {course.description}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={Link}
          to={`/courses/${course.id}`}
          size="small"
          sx={{ textTransform: "none" }}
        >
          View details →
        </Button>
      </CardActions>
    </Card>
  );
}

export default CourseCard;
