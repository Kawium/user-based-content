import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/userContext";
import "../components/login.css";

export default function Login() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for the form
    const loginForm = event.currentTarget;
    if (loginForm.checkValidity() === false) {
      event.preventDefault();
      setValidated(true);
    } else {
      loginRes();
    }
  };

  const loginRes = async () => {
    let status = await context.login(username, password);
    if (status) {
      setUsername("");
      setPassword("");
      navigate("/");
    } else {
      toast.error("Wrong password or username!");
      setUsername("");
      setPassword("");
    }
  };

  if (context.isLoggedIn) {
    navigate("/");
  }

  return (
    <div className="loginContainer">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="background-login-box">
        <h2>Login</h2>

        {/* Login form */}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validation1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                size="lg"
                required
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.currentTarget.value)}
                value={username}
              />
              <Form.Control.Feedback type="invalid">
                Please write your username
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validation2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="lg"
                required
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
                value={password}
              />
              <Form.Control.Feedback type="invalid">
                Please write your password
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button className="loginBtn" variant="success" type="submit">
            Log In
          </Button>
        </Form>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <span>No account?</span>
        </Link>
        <span>Forgot password?</span>
      </div>
    </div>
  );
}
