import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    navigate("/login");
    return null;
  }

  return <>{children}</>;
});
