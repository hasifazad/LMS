import { Routes, Route } from "react-router-dom";

import MentorsList from "../pages/MentorsList";
import StudentsList from "../pages/StudentsList";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";



export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/mentor" element={<MentorsList />} />
                <Route path="/student" element={<StudentsList />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}