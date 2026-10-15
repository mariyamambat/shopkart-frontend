import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../services/api";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !phone) {
      setError("Please fill all the fields");
      return;
    }

    try {
      await registerCustomer({ fullName, email, password, phone });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input
            type="text"
            maxLength={10}
            pattern="[0-9]{10}"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit">Create account</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;