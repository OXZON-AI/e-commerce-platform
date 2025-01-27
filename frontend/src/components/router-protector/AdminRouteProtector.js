import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRouteProtector = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state

  // Redirect to user account if admin is not logged in
  if (userInfo.role !== 'admin') {
    return <Navigate to="/my-account" replace />;
  }

  // Render the protected component if admin is logged in
  return children;
};

export default AdminRouteProtector;
