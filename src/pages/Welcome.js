// src/pages/Welcome.js
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Welcome = () => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    console.log("No auth object");
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Welcome, {auth?.username}!</h2>
      <p>You are successfully logged in.</p>
    </div>
  );
};

export default Welcome;
