import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { user } = await loginUser({ email, password });
      login(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
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
