import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignInSide from './SignInSide';
import SignUp from './SignUp';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    // ... (your fetch code remains unchanged)
  }, []);

  return (
    
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">My Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Sign In</Nav.Link>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            {/* ... other nav links ... */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<SignInSide />} />
        <Route path="/signup" element={<SignUp />} />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}

export default App;
