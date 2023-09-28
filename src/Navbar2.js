// Navbar2.js
import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Import the CSS file

const Navbar2 = () => {
  return (
    <div className="texas-a-m-branded">
      <div className="logo-container">
        <img
          className="maroon-logo"
          src="./Group.png"
          alt="Logo"
        />
      </div>
      <div className="nav-buttons">
        <Link to="/signin" className="nav-button">Signin</Link>
        <Link to="/signup" className="nav-button">Signup</Link>
        <Link to="/" className="nav-button">
          <img
            src="Pageone.png" 
            alt="Home"
            style={{ width: '100px' }}
          />
        </Link>
        <Link to="/plan-of-safe-care" className="nav-button">Plan of Safe Care</Link>
        <Link to="/your-documentation" className="nav-button">Your Documentation</Link>
        <Link to="/about" className="nav-button">About</Link>
        <a
          href="https://oliviahealth.org/"
          className="nav-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          OliviaHealth
        </a>
      </div>
    </div>
  );
};

export default Navbar2;

