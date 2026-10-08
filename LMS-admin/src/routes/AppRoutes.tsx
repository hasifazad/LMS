import { Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import TrainerRoutes from "./TrainerRoutes";
import StudentRoutes from "./StudentRoutes";
import AdminLoginPage from "../pages/admin/Login";
import HomePage from "../pages/HomePage";
import PageNotFound from "../components/common/PageNotFound";
import StudentLoginPage from "../pages/student/Login";
import LoginPage from "../pages/trainer/TrainerLogin";
import Home from "../pages/Home";



const AppRoutes = () => {
    return (

        <Routes>
            {/* Public Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            <Route path="/trainer/login" element={<LoginPage />} />

            {/* Role Based Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/trainer/*" element={<TrainerRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />

            {/* Default Redirect */}
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<Home />} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>

    );
};

export default AppRoutes;