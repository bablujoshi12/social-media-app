import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Token hi nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // JWT expire ho chuka hai
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");

      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    // Token invalid/corrupt hai
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
