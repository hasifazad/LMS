import { Routes, Route } from "react-router-dom";




import HomePage from "../pages/admin/Dashboard";
import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "./ProtectedRoutes";
import StudentDashboard from "../pages/student/Dashboard";
import AssignmentsPage from "../pages/student/Assignment";
import AssignmentDetails from "../pages/student/AssignmentDetail";
import Certificate from "../pages/student/Certificate";
import StudentAttendance from "../pages/student/Attendance";
import StudentProjects from "../pages/student/Project";
import StudentLoginPage from "../pages/student/Login";
import ProjectDetails from "../pages/student/ProjectDetail";
import StudentSettings from "../pages/student/Settings";
import UpdateStudent from "../components/student/UpdateStudent";

const StudentRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["student"]}>
            <Routes>

                <Route path="/login" element={<StudentLoginPage />} />
            </Routes>
            <StudentLayout>
                <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/assignments" element={<AssignmentsPage />} />
                    <Route path="/assignments/:id" element={<AssignmentDetails />} />
                    <Route path="/certificate" element={<Certificate />} />
                    <Route path="/attendance" element={<StudentAttendance />} />
                    <Route path="/projects" element={<StudentProjects />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/setting" element={<StudentSettings />} />
                    <Route path="/edit/:id" element={<UpdateStudent />} />
                </Routes>
            </StudentLayout>
        </ProtectedRoute>
    );
};

export default StudentRoutes;