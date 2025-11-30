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

export async function getCourseReviews(id) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/reviews`);
  return handleResponse(res);
}

export async function createCourseReview(id, data) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// authentication functions
export async function registerUser(data) {
  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginUser(data) {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

