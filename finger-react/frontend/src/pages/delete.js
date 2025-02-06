import React, { useState } from "react";
import "./delete.css";

const DeleteVoter = () => {
  const [voterID, setVoterID] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3003/api/delete-voter/${voterID}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Voter with ID ${voterID} has been successfully deleted.`);
      } else {
        setMessage(data.error || "Failed to delete voter.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="delete-container">
      <h1>Delete Voter</h1>
      <form onSubmit={handleDelete} className="delete-form">
        <div className="form-group">
          <label htmlFor="voterID">Voter ID:</label>
          <input
            type="text"
            id="voterID"
            value={voterID}
            onChange={(e) => setVoterID(e.target.value)}
            required
            placeholder="Enter Voter ID"
          />
        </div>
        <button type="submit" className="delete-button">
          Delete Voter
        </button>
      </form>
      {message && <p className="delete-message">{message}</p>}
    </div>
  );
};

export default DeleteVoter;
