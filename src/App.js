import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSide from './SignInSide';
import SignUp from './SignUp';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar2 from "./Navbar2";
import Home from "./Home";
import PlanOfSafeCare from "./PlanOfSafeCare";
import YourDocumentation from "./YourDocumentation";
import About from "./About";
import SubBar from "./SubBar";
import Home2 from "./HomeAuthenticated";
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

function App() {
  return (
    <Router>
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/plan-of-safe-care" element={<PlanOfSafeCare />} />
        <Route path="/your-documentation" element={<YourDocumentation />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUp />} />
        {/* ... other routes ... */}
      </Routes>
      <SubBar />
    </Router>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

