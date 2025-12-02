import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { registerUser } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

async function registerUser({ name, email, password}) {
  const res = await fetch("http://localhost:3000/users",{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,   // backend expects 'username'
      password,          // backend expects 'password'
      type: "student",   // add a default user type
    }),
  })
  if (!res.ok) {
    const text = await res.text(); // handle HTML error pages
    throw new Error(text || "Registration failed");
  }

  return res.json();
}


function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { user } = await registerUser({ name, email, password });
      login(user); // auto-log in after sign-up
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not create account.");
    }
  }

  return (
    <section style={{ width: "100%", maxWidth: "400px" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", margin: "0.25rem 0 0.75rem" }}
          />
        </label>

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

        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
}

export default RegisterPage;
