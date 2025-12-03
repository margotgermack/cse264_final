const API_BASE_URL = "http://localhost:3000";

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getCourses() {
  const res = await fetch(`${API_BASE_URL}/courses`);
  return handleResponse(res);
}

export async function getCourse(id) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`);
  return handleResponse(res);
}

export async function getCourseRating(id) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/ratings`);
  return handleResponse(res);
}

export async function createCourseRating(id, data) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// authentication functions
export async function registerUser(data) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateRating(course_id, rating_id, data) {
  console.log(`Data being sent in updateRating: ${JSON.stringify(data)}`)
  const res = await fetch(`${API_BASE_URL}/courses/${course_id}/ratings/${rating_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return handleResponse(res)
}

// --- Course admin functions ---

export async function createCourse(data) {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCourse(id) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

// --- User admin functions ---

export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  return handleResponse(res);
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse(res);
}

export async function updateUserType(userId, type) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  return handleResponse(res);
}

// export async function CreateCourseRatingComment(course_id, data){
//   const res = await fetch(`${API_BASE_URL}/courses/${course_id}/comments`,{
//     method: "POST",
//     headers: { "Content-Type": "application/json"},
//     body: JSON.stringify(data)
//   });
//   return handleResponse(res)
// }

export async function createComment(course_id, data) {
  const res = await fetch(`${API_BASE_URL}/courses/${course_id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// fetch comments for a course
export async function getCourseComments(course_id) {
  const res = await fetch(`${API_BASE_URL}/courses/${course_id}/comments`);
  return handleResponse(res);
}


export async function updateLikes(course_id, like_id, data) {
  const res = await fetch (`${API_BASE_URL}/courses/${course_id}/likes/${like_id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return handleResponse(res)
}

export async function getCourseLike(id) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/likes`);
  return handleResponse(res);
}