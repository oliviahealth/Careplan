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
          src="/Group.png" // Use an absolute path
          alt="Logo"
        />
      </div>
      <div className="nav-buttons">
        {authenticated ? ( // Render different buttons based on authentication state
          <>
            {/* Buttons for authenticated users */}
            <Link to="/home2" className="nav-button open-sans-button">
              <img src="/Pageone.png" alt="Home" style={{ width: '100px' }} />
            </Link>
            <Link to="/plan-of-safe-care" className="nav-button open-sans-button">
              Plan of Safe Care
            </Link>
            <Link to="/your-documentation" className="nav-button open-sans-button">
              Your Documentation
            </Link>
            <Link to="/about" className="nav-button open-sans-button">
              About
            </Link>

            <a
          href="https://oliviahealth.org/"
          className="nav-button open-sans-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          OliviaHealth
        </a>
          </>
        ) : (
          <>
            {/* Buttons for non-authenticated users */}

            <Link to="/" className="nav-button open-sans-button">
              <img src="/Pageone.png" alt="Home" style={{ width: '100px' }} />
            </Link>
            <a
          href="https://oliviahealth.org/"
          className="nav-button open-sans-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          OliviaHealth
        </a>
            <Link to="/signin" className="nav-button open-sans-button">
              Signin/Signup
            </Link>
          </>
        )}
        {/* Common buttons */}

      </div>
    </div>
  );
};

export default Navbar2;


