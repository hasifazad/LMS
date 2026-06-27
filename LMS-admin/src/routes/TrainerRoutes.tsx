import { Routes, Route } from "react-router-dom";





// import Dashboard from "../pages/trainer/Dashboard";
import HomePage from "../pages/admin/Dashboard";
import TrainerLayout from "../layouts/TrainerLayout";
import ProtectedRoute from "./ProtectedRoutes";

const TrainerRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerLayout>
                <Routes>
                    <Route path="dashboard" element={<HomePage />} />
                </Routes>
            </TrainerLayout>
        </ProtectedRoute>
    );
};

export default TrainerRoutes;