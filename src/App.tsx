import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";
import ProfileStudent from "./pages/ProfileStudent/ProfileStudent";
import ProfileTeacher from "./pages/ProfileTeacher/ProfileTeacher";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Payment from "./pages/Payment/Payment";
import AdminDashboard1 from "./pages/AdminDashboard1/AdminDashboard1";
import Courses from "./pages/Courses/Courses";
import Teachers from "./pages/Teachers/Teachers";
import Students from "./pages/Students/Students";
import CourseDetalis from "./pages/CourseDetails/CourseDetails";
import { SnackbarProvider } from "notistack";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const hiddenRoutes = ["/login", "/register", "/ForgetPassword"];
  const hideNavAndFooter = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profileStd"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ProfileStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileTeacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <ProfileTeacher />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/profileTeacher/courseDetails/payment"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileTeacher/courseDetails"
            element={<CourseDetalis />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SnackbarProvider>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
