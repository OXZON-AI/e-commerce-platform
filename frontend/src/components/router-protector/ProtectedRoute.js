import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state

  return userInfo ? children : <Navigate to="/login-register" replace />;
};

export default ProtectedRoute;