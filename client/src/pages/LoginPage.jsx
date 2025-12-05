import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

function LoginPage() {
  // local component state manages from fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // global auth context gives login() to update the logged in user
  const { login } = useAuth();
  // used to redirect the user after successfull login
  const navigate = useNavigate();

  // handles form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // sends login request to the backend
      const { user } = await loginUser({ email, password });
      // save logged in user into shared auth context
      login(user);
      // navigate to homepage
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");

    }
  }

  return (
    <section style={{ width: "100%", maxWidth: "400px" }}>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", margin: "0.25rem 0 0.75rem" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", margin: "0.25rem 0 0.75rem" }}
          />
        </label>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        <button type="submit">Log In</button>
      </form>
    </section>
  );
}

export default LoginPage;
