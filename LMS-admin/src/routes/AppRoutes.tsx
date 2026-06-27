// import { Routes, Route } from "react-router-dom";

// import MentorsList from "../pages/MentorsList";
// import StudentsList from "../pages/StudentsList";
// import NotFound from "../pages/NotFound";
// import MainLayout from "../layouts/MainLayout";
// import Home from "../pages/Home";




// export default function AppRoutes() {
//     return (
//         <Routes>
//             <Route element={<MainLayout />}>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/trainers" element={<MentorsList />} />
//                 <Route path="/students" element={<StudentsList />} />
//             </Route>

//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );
// }




import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import TrainerRoutes from "./TrainerRoutes";
import StudentRoutes from "./StudentRoutes";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import AdminLoginPage from "../pages/auth/Login";



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
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>

    );
};

export default AppRoutes;