import React from "react";
import { useAuth } from './AuthContext'; // Import the useAuth hook
import './background.css'; // Import the CSS
import { Navigate } from 'react-router-dom'; // Import Navigate

const Home2 = () => {
  const { authenticated } = useAuth(); // Get the authenticated state from the context

  const handleButtonClick = (buttonId) => {
    console.log(`Button ${buttonId} clicked`);
  };

  if (!authenticated) {
    return <Navigate to="/" />; // Redirect to signin if not authenticated
  }

  return (
    <div className="background-container">
      <div className="text-container">
        <div className="text">Welcome to Page one!</div>
        <button id="button1" onClick={() => handleButtonClick("button1")}>Plan of safe care</button>
        <button id="button2" onClick={() => handleButtonClick("button2")}>Your Documentation</button>
        <button id="button3" onClick={() => handleButtonClick("button3")}>About</button>
      </div>
    </div>
  );
};

export default Home2;


