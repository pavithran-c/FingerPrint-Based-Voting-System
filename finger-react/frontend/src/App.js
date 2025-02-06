import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navigation";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Vote from "./pages/vote";
import AdminDashboard from "./pages/AdminDashboard";
import Insert from "./pages/Insert";
import PartyList from "./pages/candidate";
import ViewVotes from "./pages/viewvotes";
import Delete from "./pages/delete";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/insert-voter" element={<Insert />} />
        <Route path="/candidate" element={<PartyList />} />
        <Route path="/viewvotes" element={<ViewVotes />} />
        <Route path="/delete-voter" element={<Delete />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
