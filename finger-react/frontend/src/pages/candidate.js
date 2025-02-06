import React, { useState } from "react";
import "./candidate.css";
const PartyList = () => {
  const initialCandidates = [
    {
      candidate_id: 1,
      name: "Narendra Modi",
      party: "Bharatiya Janata Party (BJP)",
    },
    {
      candidate_id: 2,
      name: "Mallikarjun Kharge",
      party: "Indian National Congress (INC)",
    },
    {
      candidate_id: 3,
      name: "Arvind Kejriwal",
      party: "Aam Aadmi Party (AAP)",
    },
    {
      candidate_id: 4,
      name: "Sharad Pawar",
      party: "Nationalist Congress Party (NCP)",
    },
    {
      candidate_id: 5,
      name: "Mamta Banerjee",
      party: "All India Trinamool Congress (TMC)",
    },
    {
      candidate_id: 6,
      name: "Chirag Paswan",
      party: "Lok Janshakti Party (LJP)",
    },
  ];

  const [candidates, setCandidates] = useState(initialCandidates);
  const handleVoteClick = (candidateID) => {
    const updatedCandidates = candidates.map((candidate) =>
      candidate.candidate_id === candidateID
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );
    setCandidates(updatedCandidates);
    fetch("http://localhost:3003/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Vote updated:", data);
      })
      .catch((error) => {
        console.error("Error updating vote:", error);
      });

    alert(`You voted for candidate ID ${candidateID}`);
  };

  return (
    <div className="party-list">
      <h2>Political Party Leaders</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.candidate_id}>
            <span>
              {candidate.name} - {candidate.party}
            </span>
            <button onClick={() => handleVoteClick(candidate.candidate_id)}>
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartyList;
