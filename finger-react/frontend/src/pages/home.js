import React from "react";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Online Voting System</h1>
        <p>Your voice matters! Cast your vote with ease and security.</p>
      </header>

      <section className="home-section">
        <div className="home-image">
          <img src="/images/voter.webp" alt="Voting banner" />
        </div>
        <div className="home-content">
          <h2>About This Project</h2>
          <p>
            The Online Voting System is designed to streamline the voting
            process for both voters and administrators. With this system, voters
            can register, vote securely, and have their voices heard without the
            need for in-person voting. It is a reliable, secure, and efficient
            system designed to ensure fair elections.
          </p>
        </div>
      </section>

      <section className="home-section features">
        <h2>Features of the System</h2>
        <ul>
          <li>Secure voter registration and authentication</li>
          <li>Easy-to-use voting interface</li>
          <li>Real-time vote tracking for administrators</li>
          <li>Transparency and accuracy in vote counting</li>
          <li>Fully automated process from start to finish</li>
        </ul>
      </section>

      <footer className="home-footer">
        <p>Contact us for more details: admin@votingsystem.com</p>
      </footer>
    </div>
  );
};

export default Home;
