import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./vote.css";

const VoterIDMatch = () => {
  const [voterID, setVoterID] = useState("");
  const [fingerprint, setFingerprint] = useState(null);
  const [voterDetails, setVoterDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFingerprintUploaded, setIsFingerprintUploaded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();
  const handleFetchVoterDetails = (e) => {
    e.preventDefault();
    if (!voterID) {
      setErrorMessage("Please enter a Voter ID.");
      return;
    }
    fetch("http://localhost:3003/api/fetch-voter-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.voterDetails) {
          setVoterDetails(data.voterDetails);
          setHasVoted(data.voterDetails.hasVoted);
          setIsFingerprintUploaded(false);
          setErrorMessage("");
        } else {
          setErrorMessage("Voter not found. Please check the Voter ID.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };
  const handleFingerprintVerification = (e) => {
    e.preventDefault();
    if (!fingerprint || !voterDetails?.fingerprint_hash) {
      setErrorMessage(
        "Please upload a fingerprint and ensure Voter Details are fetched."
      );
      return;
    }
    const formData = new FormData();
    formData.append("fingerprint", fingerprint);
    formData.append("fingerprint_hash", voterDetails.fingerprint_hash);
    fetch("http://localhost:3003/api/verify-fingerprint", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Fingerprint matches") {
          setErrorMessage("");
          if (voterDetails.hasVoted) {
            setErrorMessage("You have already voted. You cannot vote again.");
          } else {
            navigate("/candidate");
          }
        } else {
          setErrorMessage("Invalid fingerprint. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="voter-verification">
      <h2>Voter Verification</h2>
      {!voterDetails && !isFingerprintUploaded && (
        <form onSubmit={handleFetchVoterDetails}>
          <div>
            <label>Enter Voter ID: </label>
            <input
              type="text"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
              required
            />
          </div>
          <button type="submit">Fetch Voter Details</button>
        </form>
      )}
      {voterDetails && hasVoted && (
        <div className="error-message">
          You have already voted. You cannot vote again.
        </div>
      )}

      {voterDetails && !hasVoted && !isFingerprintUploaded && (
        <div>
          <h3>Voter Details:</h3>
          <p>
            <strong>Name:</strong> {voterDetails.name}
          </p>
          <p>
            <strong>Date of Birth:</strong> {voterDetails.dob}
          </p>
          <form onSubmit={handleFingerprintVerification}>
            <div>
              <label>Upload Fingerprint: </label>
              <input
                type="file"
                onChange={(e) => setFingerprint(e.target.files[0])}
                required
              />
            </div>
            <button type="submit">Verify Fingerprint</button>
          </form>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default VoterIDMatch;
