import React from "react";
import { useNavigate } from "react-router-dom";
import "./admins.css"; // Import the new external CSS

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      <div className="button-container">
        <button className="admin-button" onClick={() => navigate("/insert-voter")}>
          Insert Voter
        </button>
        <button className="admin-button" onClick={() => navigate("/delete-voter")}>
          Delete Voter
        </button>
        <button className="admin-button" onClick={() => navigate("/viewvotes")}>
          View Votes
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
