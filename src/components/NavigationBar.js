import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useEffect, useState} from "react";

function BasicExample() {
    const [token, setToken] = useState('');
    const [hasToken, setHasToken] = useState(false);
    const [groups, setGroup] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            setHasToken(true);
        }
        if (localStorage.getItem('group')) {
            setGroup(localStorage.getItem('group'));
        }
    }, [token]);

  return (
      <Navbar expand="lg" className="bg-body-tertiary p-3">
      <Navbar.Brand href="/" className="ms-3">Navigation Bar</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/" className="me-3">Home</Nav.Link>
          <Nav.Link href="/login" className="me-3">Login</Nav.Link>
          {groups === 'Administrators' && <Nav.Link href="/admin" className="me-3">Admin</Nav.Link>}
          {groups === 'Lecturers' && <Nav.Link href="/lecturer" className="me-3">Lecturer</Nav.Link>}
          {groups === 'Students' && <Nav.Link href="/student" className="me-3">Student</Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default BasicExample;