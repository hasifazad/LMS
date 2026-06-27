import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/admin/Dashboard";
import StudentsList from "../pages/StudentsList";
import TrainersList from "../pages/TrainersList";
import CreateStudent from "../components/student/UpdateStudent";
import CreateStudentForm from "../components/student/forms/CreateStudentForm";
import UpdateStudent from "../components/student/UpdateStudent";
import CourseList from "../components/admin/CourseList";
import StudentBatches from "../components/admin/Batches";
import BatchDetails from "../components/admin/BatchDetails";
import CreateBatch from "../components/admin/AddBatches";

// import ProtectedRoute from "./ProtectedRoute";

// import AdminLayout from "../layouts/AdminLayout";

// import Dashboard from "../pages/admin/Dashboard";

// import StudentsList from "../pages/admin/Students/StudentsList";
// import AddStudent from "../pages/admin/Students/AddStudent";

// import TrainersList from "../pages/admin/Trainers/TrainersList";

// import CoursesList from "../pages/admin/Courses/CoursesList";

const AdminRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    {/* Students */}
                    <Route path="students/create" element={<CreateStudentForm />} />

                    <Route path="/students" element={<StudentsList />} />
                    <Route path="/students/update/:id" element={<UpdateStudent />} />

                    {/* Trainers */}
                    <Route path="trainers" element={<TrainersList />} />

                    {/* Courses */}
                    <Route path="/courses" element={<CourseList />} />

                    <Route path="/batches" element={<StudentBatches />} />
                    <Route path="/batches/:id" element={<BatchDetails />} />
                    <Route path="/batches/add" element={<CreateBatch />} />
                </Routes>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminRoutes;