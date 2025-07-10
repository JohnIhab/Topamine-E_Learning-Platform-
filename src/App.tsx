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

import { SnackbarProvider } from "notistack";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const location = useLocation();
  const hiddenRoutes = ["/login", "/register", "/ForgetPassword"];
  const hideNavAndFooter = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}

      <SnackbarProvider maxSnack={3}>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profileStd" element={<ProfileStudent />} />
          <Route path="/profileTeacher" element={<ProfileTeacher />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<AdminDashboard1 />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/Teachers" element={<Teachers />} />
          <Route path="/Students" element={<Students />} />
        </Routes>
      </SnackbarProvider>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
