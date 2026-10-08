import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useTrainerAuthStore } from "../stores/trainerAuthStore";
import { useStudentAuthStore } from "../stores/studentAuthStore";
import { useAdminAuthStore } from "../stores/adminAuthStore";

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
    // const admin = JSON.parse(localStorage.getItem("admin") || "null");
    // const trainer = JSON.parse(localStorage.getItem("trainer-auth") || "null");
    const location = useLocation();

    let role = location.pathname.split('/')[1]
    let { admin, setAuth: setAdmin, token: adminToken } = useAdminAuthStore((state) => state)
    let { trainer, setAuth: setTrainer, token: trainerToken } = useTrainerAuthStore((state) => state)
    let { student, setAuth: setStudent, token: studentToken } = useStudentAuthStore((state) => state)
    // const setUser = useAuthStore((state) => state.setUser);

    // console.log(trainer);
    console.log('0000000000000000', student);


    if (!student && role == 'student') {
        console.log('hellooo');

        return <Navigate to="/student/login" replace />;
    } else {
        // setStudent(student, studentToken)
    }

    if (!admin && role == 'admin') {
        return <Navigate to="/admin/login" replace />;
    } else {
        // setUser(admin)
    }


    if (!trainer && role == 'trainer') {
        return <Navigate to="/trainer/login" replace />;
    } else {
        // setTrainer(trainer, trainerToken)
    }

    // Role Not Allowed
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;