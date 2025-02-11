import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminRouteProtector = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux state

  const token = Cookies.get('token');
  console.log("Auth Token in Cookies : ", token);
  

  // Redirect to login if auth token is not in cookies
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
