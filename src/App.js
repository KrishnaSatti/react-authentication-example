// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import Welcome from "./pages/Welcome";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
