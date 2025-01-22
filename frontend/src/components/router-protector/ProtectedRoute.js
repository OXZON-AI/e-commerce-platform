import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state

  // Redirect to login page if userInfo is null
  if (!userInfo) {
    return <Navigate to="/login-register" replace />;
  }

  // Render the protected component if userInfo exists
  return children;
};

export default ProtectedRoute;
