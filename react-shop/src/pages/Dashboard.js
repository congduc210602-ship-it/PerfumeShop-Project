import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/products")}>Manage Products</button>
        <button onClick={() => navigate("/categories")}>Manage Categories</button>
      </div>
    </div>
  );
}

export default Dashboard;
