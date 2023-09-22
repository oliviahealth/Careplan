import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Import the CSS file

const Navbar2 = () => {
  return (
    React.createElement("div", { className: "texas-a-m-branded" },
      React.createElement("div", { className: "logo-container" },
        React.createElement("img", {
          className: "maroon-logo",
          src: "./TAM-PrimaryMarkB.png",
          alt: "Logo"
        })
      ),
        React.createElement("div", { className: "nav-buttons" },
        React.createElement(Link, { to: "/signin", className: "nav-button" }, "Signin"),
        React.createElement(Link, { to: "/signup", className: "nav-button" }, "Signup"),
        React.createElement(Link, { to: "/", className: "nav-button" }, "Home"),
        React.createElement(Link, { to: "/plan-of-safe-care", className: "nav-button" }, "Plan of Safe Care"),
        React.createElement(Link, { to: "/your-documentation", className: "nav-button" }, "Your Documentation"),
        React.createElement(Link, { to: "/about", className: "nav-button" }, "About"),
        React.createElement("a", { href: "https://oliviahealth.org/", className: "nav-button", target: "_blank", rel: "noopener noreferrer" }, "OliviaHealth")
      )
    )
  );
};

export default Navbar2;
