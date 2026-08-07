import { Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import TrainerRoutes from "./TrainerRoutes";
import StudentRoutes from "./StudentRoutes";
import AdminLoginPage from "../pages/auth/Login";
import HomePage from "../pages/HomePage";
import PageNotFound from "../components/common/PageNotFound";



const AppRoutes = () => {
    return (

        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AdminLoginPage />} />

            {/* Role Based Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/trainer/*" element={<TrainerRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />

            {/* Default Redirect */}
            <Route path="/" element={<HomePage />} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>

    );
};

export default AppRoutes;