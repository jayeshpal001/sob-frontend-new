// src/components/admin/AdminProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export const AdminProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");
  const userStr = localStorage.getItem("adminUser");

  let isAdmin = false;
  
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "admin") {
        isAdmin = true;
      }
    }
  } catch (error) {
    console.error("Security Check: Failed to parse user data.");
  }

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};