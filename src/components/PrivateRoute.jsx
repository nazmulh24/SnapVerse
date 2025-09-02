import { Navigate, Outlet } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import LoadingSpinner from "./shared/LoadingSpinner";

const PrivateRoute = () => {
  const { authTokens, user, loading } = useAuthContext();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // If no auth tokens, redirect to login
  if (!authTokens || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default PrivateRoute;
