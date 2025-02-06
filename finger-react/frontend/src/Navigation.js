// src/components/Navigation.jsx
import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import "./styles.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink to="/home" activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/vote" activeClassName="active">
            Vote
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" activeClassName="active">
            Admin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
