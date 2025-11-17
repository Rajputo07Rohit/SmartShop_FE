import React from "react";
import { Navigate } from "react-router-dom";

export default function Public({ children }) {
  const token = localStorage.getItem("token");

  // If logged in → redirect AWAY from login/register
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
