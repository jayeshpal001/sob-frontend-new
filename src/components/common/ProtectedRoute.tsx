// src/components/common/ProtectedRoute.tsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  requireAdmin?: boolean; 
}

export const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  console.log("GUARD CHECK ->", { 
    tryingToAccess: location.pathname, 
    isAuthenticated, 
    userRole: user?.role 
  });

  // Scenario 1: User is completely logged out
  if (!isAuthenticated || !user) {
    console.log("Access Denied: User not logged in, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Scenario 2: Route needs Admin access, but user is NOT an Admin (Customer trying to act smart)
  if (requireAdmin && user.role !== "admin") {
    console.log(` Access Denied: Requires Admin, but user is ${user.role}`);
    return <Navigate to="/" replace />;
  }

  // NAYA SCENARIO 3: Route is for Customers, but user IS an Admin
  if (!requireAdmin && user.role === "admin") {
    console.log("Access Denied: Admins belong in the Admin Portal!");
    // Admin ko uske sahi thikane (dashboard) par bhej do
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Scenario 4: All checks passed. Render the nested routes!
  console.log("ACTION: Access Granted!");
  return <Outlet />;
};