import React from "react";
import './background.css'; // Import the CSS

const Home = () => {
  const handleButtonClick = (buttonId) => {
    console.log(`Button ${buttonId} clicked`);
  };

  return (
    React.createElement("div", { className: "background-container" },
      React.createElement("div", { className: "text-container" },
        React.createElement("div", { className: "text" }, "Welcome to PageOne!"),
        React.createElement("button", { id: "button1", onClick: () => handleButtonClick("button1") }, "Get started")
      )
    )
  );
};

export default Home;
