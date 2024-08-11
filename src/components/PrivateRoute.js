// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return accessToken ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
