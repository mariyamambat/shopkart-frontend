import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCustomer } from "../services/api";
import { useCart } from "../context/CartContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginCustomer({ email, password });
      await fetchCart();
      navigate("/home");
    } catch (err) {
      setError(err.message || "Invalid Credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="form-error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;