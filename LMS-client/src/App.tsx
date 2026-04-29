import React, { useEffect, useState } from 'react'

import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from './components/Navbar';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SideBar from './components/SideBar';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StudentsPage from './pages/StudentsPage';
import BatchesPage from './pages/BatchesPage';
import PageNotFound from './components/PageNotFound';
import BatchDetailsPage from './pages/BatchDetailsPage';
import LoginPage from './pages/LoginPage';
import { fetchData } from './axios/fetchData';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/store';

import AssignmentPage from './pages/AssignmentPage';
import CoursePage from './pages/CoursePage';


const Layout = () => {
  return (
    <div className='p-2 md:p-4 '>

      <Navbar />

      <div className="md:flex md:gap-3 md:mt-4">
        <div className="flex-1">
          <SideBar />
        </div>
        <div className="flex-[3] lg:flex-[4]">
          <Outlet /> {/* Nested route content will be rendered here */}
        </div>
      </div>
    </div>
  );
};

const NoLayout = () => {
  return <Outlet />; // Just render the nested routes (no Navbar, no SideBar)
};


// Protected layout to check for authentication
// function ProtectedLayout({ user }: any) {



//   if (!user) {
//     console.log(user);
//     return <Navigate to="/login" />;

//   }

//   return (
//     <div>
//       {/* This will render nested routes */}
//       <Outlet />
//     </div>
//   );
// }



let App: React.FC = () => {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  // let navigate = useNavigate()
  let dispatch = useDispatch()
  // let [login, setLogin] = useState<any>(false); // Use `null` as initial state to check if loading is complete
  let [loading, setLoading] = useState(true); // Track loading state

  let user = useSelector((state: any) => state.user.value)
  useEffect(() => {
    let token = localStorage.getItem('token')
    fetchData.get('/staff/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      if (res.data.success) {
        // setLogin(true);
        dispatch(setUser(res.data.data))
      } else {
        // setLogin(false);
      }
      setLoading(false);
    }).catch((err: any) => {
      console.log(err);
      setLoading(false);
    })




  }, [])

  if (loading) {
    return;
  }

  return (
    <>


      <Routes>
        {user ?
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/student/:id" element={<StudentDetailsPage />} />
            <Route path="/student/:studentId/assignment" element={<AssignmentPage />} />
            <Route path="/batches" element={<BatchesPage />} />
            <Route path="/batch/:id" element={<BatchDetailsPage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/*" element={<PageNotFound />} />
          </Route>
          : <Route path="*" element={<Navigate to='/login' />} />

        }
        <Route element={<NoLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>


      </Routes>


    </>
  )
}

export default App;
