import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const location = useLocation();

    let role = location.pathname.split('/')[1]

    console.log(role);

    console.log(allowedRoles);
    


    const setUser = useAuthStore((state) => state.login);
    // Not Logged In
    if (!user && role == 'student') {
        console.log('hellooo');

        return <Navigate to="/student/login" replace />;
    } else {
        setUser(user, '')
    }

    if (!admin && role == 'admin') {
        console.log('hellooo');

        return <Navigate to="/admin/login" replace />;
    } else {
        setUser(user, '')
    }

    // Role Not Allowed
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;