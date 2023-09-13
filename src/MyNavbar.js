import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import "./MyNavbar.css";
import { FaCalendarPlus } from "react-icons/fa6";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useState } from "react";

function MyNavbar() {
  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add New Note
    </Tooltip>
  );

  const handleMoveToAddNewNote = () => {
    
  };


  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand>Note Remaider</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-1">
              <NavLink to="/" className="ll">
                Home
              </NavLink>
              <NavLink to="/Schedule" className="ll">
                Schedule{" "}
              </NavLink>
            </Nav>

            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip}
              show={showTooltip}
            >
              <Button
                variant="success"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleMoveToAddNewNote}
              >
                <NavLink to='/AddNote' className='add'><FaCalendarPlus />
                </NavLink>
              </Button>
            </OverlayTrigger>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
