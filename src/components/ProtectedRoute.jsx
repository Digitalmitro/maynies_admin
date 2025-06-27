import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const role = localStorage.getItem("role"); 
    const location = useLocation(); 
  
    if (!role) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return <Outlet />;
  };

export default ProtectedRoute;
  