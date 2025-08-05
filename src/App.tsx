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
import Checkout from "./pages/CheckoutPage";
import Video from "./pages/VideoShow/VideoShow";
import PaymentResult from "./pages/PaymentSuccess";
import Chat from "./pages/Chat/Chat";
import ChatList from "./pages/Chat/ChatList";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherDashboardLayout from './components/TeacherHome/TeacherDashboardLayout';
import TeachHome from './components/TeacherHome/TeacherHome';
import CourseManagment from './components/CourseManagment/CourseManagment';
import StudentsComponent from './components/Students/Students';
import AddNewCourse from './components/AddNewCourse/NewCourse';
import Messages from './components/Messages/Messages';
import { useThemeMode } from './context/ThemeContext';
import { useEffect } from 'react';
import ThemeTestPage from './pages/ThemeTest/ThemeTestPage';
import Chatbot from "./pages/ChatBot/ChatBot";

function App() {
  const location = useLocation();
  const { isDarkMode } = useThemeMode();
  const hiddenRoutes = ["/login", "/register", "/ForgetPassword"];
  const hideNavAndFooter = hiddenRoutes.includes(location.pathname);

  const hideChatbotRoutes = [
    "/login",
    "/register",
    "/ForgetPassword",
    "/profileTeacher/courseDetails/payment",
    "/Checkout"
  ];
  const hideChatbot = hideChatbotRoutes.includes(location.pathname);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <SnackbarProvider maxSnack={3}>

        <Routes>
          <Route
            path="/teacherdashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeachHome />} />
            <Route path="courses" element={<CourseManagment />}>
              <Route path="add" element={<AddNewCourse />} />
            </Route>
            <Route path="students" element={<StudentsComponent />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route path="/profileTeacher/courseDetails/:courseId" element={<CourseDetalis />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/theme-test" element={<ThemeTestPage />} />
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
            path="/profileTeacher/:id?"
            element={
              <ProtectedRoute allowedRoles={["teacher", "student"]}>
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
            element={
              <ProtectedRoute allowedRoles={["teacher", "student"]}>
                <CourseDetalis />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/Checkout"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/video" element={<Video />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/chats" element={<ChatList />} />

          <Route path="/paymentSuccess" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PaymentResult />
            </ProtectedRoute>
          } />
        </Routes>
      </SnackbarProvider>
      {!hideNavAndFooter && <Footer />}
      {!hideChatbot && <Chatbot />}
    </>
  );
}

export default App;
