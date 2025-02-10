import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRouteProtector = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state
  console.log("admin route protector : ", userInfo);

  // Redirect to user account if admin is not logged in
  if (!userInfo) {
    return <Navigate to="/my-account" replace />;
  } else if (userInfo.role !== "admin") {
    return <Navigate to="/unauthorized-access" replace />
  }

  // Render the protected component if admin is logged in
  return children;
};

export default AdminRouteProtector;
