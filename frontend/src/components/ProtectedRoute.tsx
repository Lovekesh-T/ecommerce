import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PropTypes {
  isAuthenticated: boolean;
  adminOnly?: boolean;
  isAdmin?: boolean;
  redirect?: string;
  children?: ReactElement;
}

export const ProtectedRoute = ({
  isAuthenticated,
  adminOnly,
  isAdmin,
  redirect = "/",
  children,
}: PropTypes) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if (adminOnly && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
