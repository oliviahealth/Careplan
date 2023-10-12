import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from './AuthContext'; // Import the useAuth hook
import "./App.css"; // Import the CSS file

const Navbar2 = () => {
  const { authenticated } = useAuth(); // Get the authenticated state from the context

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
        {authenticated ? ( // Render different buttons based on authentication state
          <>
            {/* Buttons for authenticated users */}
            <Link to="/plan-of-safe-care" className="nav-button">
          Plan of Safe Care
        </Link>
        <Link to="/your-documentation" className="nav-button">
          Your Documentation
        </Link>
        <Link to="/about" className="nav-button">
          About
        </Link>
        <Link to="/home2" className="nav-button">
          <img src="Pageone.png" alt="Home" style={{ width: '100px' }} />
        </Link>
          </>
        ) : (
          <>
            {/* Buttons for non-authenticated users */}
            <Link to="/signin" className="nav-button">
              Signin
            </Link>
            <Link to="/signup" className="nav-button">
              Signup
            </Link>
            <Link to="/" className="nav-button">
            <img src="Pageone.png" alt="Home" style={{ width: '100px' }} />
           </Link>
          </>
        )}
        {/* Common buttons */}
  
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

