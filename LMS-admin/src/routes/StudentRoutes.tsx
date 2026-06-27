import { Routes, Route } from "react-router-dom";




import HomePage from "../pages/admin/Dashboard";
import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "./ProtectedRoutes";
import StudentDashboard from "../pages/student/Dashboard";
import AssignmentsPage from "../pages/student/AssignmentsPage";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import Certificate from "../pages/student/CertificatePage";
import StudentAttendance from "../pages/student/StudentsAttendance";
import StudentProjects from "../pages/student/StudentProjects";

const StudentRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout>
                <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/assignments" element={<AssignmentsPage />} />
                    <Route path="/assignments/:id" element={<AssignmentDetails />} />
                    <Route path="/certificate" element={<Certificate />} />
                    <Route path="/attendance" element={<StudentAttendance />} />
                    <Route path="/projects" element={<StudentProjects />} />
                </Routes>
            </StudentLayout>
        </ProtectedRoute>
    );
};

export default StudentRoutes;