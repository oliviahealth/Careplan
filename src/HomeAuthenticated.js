import React from "react";
import './background.css'; // Import the CSS

const Home2 = () => {
  const handleButtonClick = (buttonId) => {
    console.log(`Button ${buttonId} clicked`);
  };

  return (
    React.createElement("div", { className: "background-container" },
      React.createElement("div", { className: "text-container" },
        React.createElement("div", { className: "text" }, "Welcome to Page one!"),
        React.createElement("button", { id: "button1", onClick: () => handleButtonClick("button1") }, "Plan of safe care"),
        React.createElement("button", { id: "button2", onClick: () => handleButtonClick("button2") }, "Your Documentation"),
        React.createElement("button", { id: "button3", onClick: () => handleButtonClick("button3") }, "About")
      )
    )
  );
};

export default Home2;

