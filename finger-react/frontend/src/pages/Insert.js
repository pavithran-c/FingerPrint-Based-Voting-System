import React, { useState } from "react";
import "./insert.css";

const InsertVoter = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [fingerprint, setFingerprint] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("fingerprint", fingerprint);
    const voterUniqueID = `VOTER_${Date.now()}`;
    formData.append("voterUniqueID", voterUniqueID);

    fetch("http://localhost:3003/api/insert", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Voter inserted successfully!");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="insert-container">
      <h2>Insert Voter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Birth: </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fingerprint: </label>
          <input
            type="file"
            onChange={(e) => setFingerprint(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Insert Voter</button>
      </form>
    </div>
  );
};

export default InsertVoter;
