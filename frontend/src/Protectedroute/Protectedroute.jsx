import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If there's no token, navigate to the home page (login page)
    return <Navigate to="/"/>;
  }

  // If the token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
