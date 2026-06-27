import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    // Get user from localStorage
    // const user = JSON.parse(localStorage.getItem("user") || "null");
    const location = useLocation();

    let role = location.pathname.split('/')[1]
    const user = {
        role,

    }

    // Not Logged In
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role Not Allowed
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;