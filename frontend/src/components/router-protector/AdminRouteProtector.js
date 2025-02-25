import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRouteProtector = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state

  // Redirect to login if userInfo not in state
  if (!userInfo) {
    return <Navigate to="/login-register" replace />;
  }

  // Redirect to unauthorized page if user is not an admin
  if (userInfo?.role !== "admin") {
    return <Navigate to="/unauthorized-access" replace />;
  }

  // Render the protected component if admin is logged in
  return children;
};

export default AdminRouteProtector;
