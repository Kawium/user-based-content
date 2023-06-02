import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Layout/header";
import Main from "./Layout/main";
import Login from "./login";
import Register from "./register";
import UserProvider from "../contexts/userContext";

function App() {
  return (
    <div>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
