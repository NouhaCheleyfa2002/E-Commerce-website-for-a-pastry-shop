// components/UserProtectedRoute.jsx
import { useLogin } from "../context/LoginContext";
import { Navigate, useLocation } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const { user, setShowLogin } = useLogin();
  const location = useLocation();

  if (!user) {
    setShowLogin(true); // show login modal
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;
