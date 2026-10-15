import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentCustomer } from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCurrentCustomer();
        setCustomer(data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchCustomer();
  }, [navigate]);

  if (!customer) return null;

  return (
    <div>
      <Navbar />
      <div className="home-content">
        <h2>Welcome, {customer.fullName}</h2>
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phone}</p>
      </div>
    </div>
  );
}

export default Home;