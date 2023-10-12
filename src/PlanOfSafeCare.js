import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import "./App.css"; // Import the CSS file

const PlanOfSafeCare = () => {
  const { authenticated } = useAuth(); // Get the authenticated state from the context

  if (!authenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="button-container">
        <div className="button-row">
        <Link to="/plan-of-safe-care/maternal-demographics" className="circular-button">
          Maternal Demographics
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
          Medical History
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Services for Substance Use
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Drug Screening Results
        </Link>
        </div>
        <div className="button-row">
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Family Supports
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Infant Information
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Referrals and Services
        </Link>
        <Link to="/plan-of-safe-care/medical-history" className="circular-button">
        Relapse Prevention Plan
        </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanOfSafeCare;

