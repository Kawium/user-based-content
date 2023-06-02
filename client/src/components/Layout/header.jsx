import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import "./header.css";

function Header() {
  const { isLoggedIn, logout } = useContext(UserContext);

  return (
    <div className="header">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1>Cars</h1>
      </Link>
      {isLoggedIn ? (
        <div>
          <span>{isLoggedIn.username}</span>
          <Button
            className="logout-button"
            onClick={logout}
            variant="success"
            type="submit"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link to="/login" style={{ textDecoration: "none" }}>
          <span>Login / Register</span>
        </Link>
      )}
    </div>
  );
}

export default Header;
