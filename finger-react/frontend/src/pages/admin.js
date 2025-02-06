import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [fingerprintFile, setFingerprintFile] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setFingerprintFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    formData.append("fingerprint", fingerprintFile);

    fetch("http://localhost:3003/api/admin", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          navigate("/admin-dashboard");
        } else {
          alert(data.error || "Login failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fingerprint">Fingerprint Image (TIFF format)</label>
          <input
            type="file"
            id="fingerprint"
            accept=".tif,.tiff"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
