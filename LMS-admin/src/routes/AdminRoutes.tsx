import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/admin/Dashboard";
import StudentsList from "../pages/admin/Student";
import TrainersList from "../pages/admin/Trainer";
import CreateStudent from "../components/student/UpdateStudent";
import CreateStudentForm from "../pages/admin/StudentAdd";
import UpdateStudent from "../components/student/UpdateStudent";
import CourseList from "../pages/admin/Course";
import StudentBatches from "../pages/admin/Batch";
import BatchDetails from "../pages/admin/BatchDetail";
import CreateBatch from "../pages/admin/BatchAdd";
import LearningJourney from "../pages/LearningJourney";
import PageNotFound from "../components/common/PageNotFound";

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
                    <Route path="student/create" element={<CreateStudentForm />} />

                    <Route path="/student" element={<StudentsList />} />
                    <Route path="/student/update/:id" element={<UpdateStudent />} />

                    {/* Trainers */}
                    <Route path="trainer" element={<TrainersList />} />

                    {/* Courses */}
                    <Route path="/course" element={<CourseList />} />

                    <Route path="/batch" element={<StudentBatches />} />
                    <Route path="/batch/:id" element={<BatchDetails />} />
                    <Route path="/batch/add" element={<CreateBatch />} />
                    <Route path="/learning" element={<LearningJourney />} />
                    <Route path="/*" element={<PageNotFound />} />
                </Routes>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminRoutes;