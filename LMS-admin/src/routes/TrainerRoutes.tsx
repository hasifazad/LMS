import { Routes, Route } from "react-router-dom";





// import Dashboard from "../pages/trainer/Dashboard";
import HomePage from "../pages/admin/Dashboard";
import TrainerLayout from "../layouts/TrainerLayout";
import ProtectedRoute from "./ProtectedRoutes";
import TrainerEditForm from "../pages/admin/TrainerEdit";
import LoginPage from "../pages/trainer/TrainerLogin";
import StudentsPage from "../pages/trainer/Student";
import StudentDetailsPage from "../pages/trainer/StudentDetail";
import Dashboard from "../pages/trainer/Dashboard";
import BatchesPage from "../pages/trainer/Batch";
import PageNotFound from "../components/common/PageNotFound";
import BatchDetailsPage from "../pages/trainer/BatchDetail";

const TrainerRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["trainer"]}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

            </Routes>
            <TrainerLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/student" element={<StudentsPage />} />
                    <Route path="/student/:id" element={<StudentDetailsPage />} />
                    <Route path="/batch" element={<BatchesPage />} />
                    <Route path="/batch/:id" element={<BatchDetailsPage />} />



                    <Route path="/*" element={<PageNotFound />} />
                </Routes>
            </TrainerLayout>
        </ProtectedRoute>
    );
};

export default TrainerRoutes;