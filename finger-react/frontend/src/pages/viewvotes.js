import React, { useEffect, useState } from "react";
import "./viewvotes.css";

const ViewVotes = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3003/api/get-votes")
      .then((response) => response.json())
      .then((data) => setCandidates(data.candidates))
      .catch((error) => console.error("Error fetching vote data:", error));
  }, []);

  return (
    <div className="viewvotes-container">
      <h2>Vote Counts</h2>
      <table className="viewvotes-table">
        <thead>
          <tr>
            <th>Leader</th>
            <th>Party</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.candidate_id}>
              <td>{candidate.name}</td>
              <td>{candidate.party}</td>
              <td>{candidate.vote_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewVotes;
