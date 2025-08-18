// import * as React from "react";
// import { useNavigate } from "react-router-dom";
// import { AppBar, Typography, Toolbar, Box, Stack, useTheme } from "@mui/material";

// import { useThemeMode } from "../../context/ThemeContext";

// import coursesIcon from "../../assets/images/book.png";
// import teacherIcon from "../../assets/images/board.png";
// import studentIcon from "../../assets/images/hatGrad.png";
// import payments from "../../assets/images/dollar.png";
// import dashboardIcon from "../../assets/images/dashboardIcon.png";
// import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
// import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
// import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
// import TopaminIcon from "../../assets/images/Icon-logo.png";

// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";

// export default function PrimarySearchAppBar() {
//   const [selectedItem, setSelectedItem] = React.useState("Dashboard");
//   const [studentsCount, setStudentsCount] = React.useState(0);
//   const [teachersCount, setTeachersCount] = React.useState(0);
//   const [coursesCount, setCoursesCount] = React.useState(0);
//   const [totalRevenue, setTotalRevenue] = React.useState(0);
//   const { isDarkMode } = useThemeMode();
//   const theme = useTheme();

//   const navigate = useNavigate();

//   async function fetchData() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "users"));

//       const users = querySnapshot.docs.map(doc => doc.data());

//       const students = users.filter(user => user.role === "student");
//       const teachers = users.filter(user => user.role === "teacher" && user.status === "تم القبول");
//       console.log("Teachers:", teachers);

//       setStudentsCount(students.length);
//       setTeachersCount(teachers.length);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   }
//   async function fetchCourses() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "courses"));
//       const courses = querySnapshot.docs.map(doc => doc.data());
//       setCoursesCount(courses.length);
//       console.log("Courses:", courses);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   }

//   async function fetchTotalRevenue() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "enrollments"));
//       const enrollments = querySnapshot.docs.map(doc => doc.data());

//       const total = enrollments.reduce((sum, enrollment) => {

//         const price = enrollment.price || enrollment.amount || enrollment.totalPrice || 0;
//         return sum + (typeof price === 'number' ? price : parseFloat(price) || 0);
//       }, 0);

//       setTotalRevenue(total);
//       console.log("Total Revenue:", total);
//       console.log("Enrollments:", enrollments);
//     } catch (error) {
//       console.error("Error fetching enrollments:", error);
//     }
//   }
//   React.useEffect(() => {
//     document.documentElement.lang = "ar";
//     document.documentElement.dir = "rtl";
//     fetchData();
//     fetchCourses();
//     fetchTotalRevenue();
//   }, []);

//   return (
//       <Stack
//         sx={{ display: "flex", flexDirection: "row", fontFamily: "Tajawal" }}
//       >
//         <Box sx={{ width: "200px", backgroundColor: theme.palette.background.paper, borderLeft: `1px solid ${theme.palette.divider}` }}>
//           <Stack>
//             <AppBar
//               position="static"
//               sx={{
//                 backgroundColor: theme.palette.background.paper,
//                 marginTop: "4%",
//                 boxShadow: "none",
//                 textAlign: "center",
//               }}
//             >
//               <Toolbar
//                 sx={{ display: "flex", flexDirection: "row", gap: "5px" }}
//               >
//                 <img
//                   src={TopaminIcon}
//                   alt="توبامين"
//                   style={{ width: "40px", height: "40px" }}
//                 />
//                 <Typography
//                   variant="h6"
//                   noWrap
//                   component="div"
//                   sx={{
//                     display: {
//                       xs: "none",
//                       sm: "block",
//                       color: theme.palette.text.primary,
//                       fontWeight: "700",
//                       fontSize: "30",
//                       marginLeft: "20px",
//                     },
//                   }}
//                 >
//                   توبامين
//                 </Typography>
//               </Toolbar>
//             </AppBar>

//             <Box
//               onClick={() => {
//                 setSelectedItem("Dashboard");
//                 navigate("/admin");
//               }}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 height: "70px",
//                 padding: "12% 23%",
//                 gap: "10%",
//                 cursor: "pointer",
//                 backgroundColor:
//                   selectedItem === "Dashboard" ? theme.palette.primary.main + "20" : "transparent",
//                 color: selectedItem === "Dashboard" ? theme.palette.primary.main : theme.palette.text.secondary,
//                 transition: "0.3s background-color ease",
//                 '&:hover': {

//                   backgroundColor: theme.palette.primary.main + "10",
//                 },
//               }}
//             >
//               <img
//                 src={dashboardIcon}
//                 alt="dashboardicon"
//                 style={{ height: "20px", width: "20px" }}
//               />
//               <Typography> لوحه التحكم</Typography>
//             </Box>
//             <Box
//               onClick={() => {
//                 setSelectedItem("Courses");
//                 navigate("/Courses");
//               }}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",

//                 height: "70px",
//                 padding: "10% 23%",
//                 gap: "10%",
//                 cursor: "pointer",
//                 marginTop: "2%",

//                 backgroundColor:
//                   selectedItem === "Courses" ? theme.palette.primary.main + "20" : "transparent",
//                 color: selectedItem === "Courses" ? theme.palette.primary.main : theme.palette.text.secondary,
//                 transition: "0.3s background-color ease",
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.main + "10",
//                 },
//               }}
//             >
//               <img
//                 src={grayCoursesIcon}
//                 alt="coursesIcon"
//                 style={{ height: "25px" }}
//               />
//               <Typography> الكورسات</Typography>
//             </Box>

//             <Box
//               onClick={() => {
//                 setSelectedItem("Teachers");
//                 navigate("/Teachers");
//               }}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",

//                 height: "70px",
//                 padding: "10% 23%",
//                 gap: "10%",
//                 cursor: "pointer",
//                 marginTop: "2%",

//                 backgroundColor:
//                   selectedItem === "Teachers" ? theme.palette.primary.main + "20" : "transparent",
//                 color: selectedItem === "Teachers" ? theme.palette.primary.main : theme.palette.text.secondary,
//                 transition: "0.3s background-color ease",
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.main + "10",
//                 },
//               }}
//             >
//               <img
//                 src={grayTeachersIcon}
//                 alt="teachersIcon"
//                 style={{ height: "25px" }}
//               />
//               <Typography> المعلمون</Typography>
//             </Box>
//             <Box
//               onClick={() => {
//                 setSelectedItem("Students");
//                 navigate("/Students");
//               }}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 height: "70px",
//                 padding: "10% 23%",
//                 gap: "10%",
//                 cursor: "pointer",
//                 marginTop: "2%",

//                 backgroundColor:
//                   selectedItem === "Students" ? theme.palette.primary.main + "20" : "transparent",
//                 color: selectedItem === "Students" ? theme.palette.primary.main : theme.palette.text.secondary,
//                 transition: "0.3s background-color ease",
//                 '&:hover': {
//                   backgroundColor: theme.palette.primary.main + "10",
//                 },
//               }}
//             >
//               <img
//                 src={grayStudentsIcon}
//                 alt="studentIcon"
//                 style={{ height: "25px" }}
//               />
//               <Typography> الطلاب</Typography>
//             </Box>

//           </Stack>
//         </Box>

//         <Box
//           sx={{
//             flexGrow: 1,
//             backgroundColor: theme.palette.background.default,
//             minHeight: "100vh",
//             borderRight: `1px solid ${theme.palette.divider}`,
//           }}
//         >

//           <Stack
//             sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
//           >
//             <Box
//               sx={{
//                 width: "260px",
//                 height: "160px",
//                 padding: "40px",
//                 margin: "10px ",
//                 borderRadius: "20px",
//                 backgroundColor: isDarkMode ? theme.palette.primary.dark + "30" : "#F3F4FF",
//                 fontFamily: "Tajawal",
//               }}
//             >
//               <img src={studentIcon} alt="الطلاب" />
//               <Typography sx={{ color: theme.palette.text.secondary }}>الطلاب </Typography>
//               <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
//                 {studentsCount} طالب
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 width: "260px",
//                 height: "160px",
//                 padding: "40px",
//                 margin: "10px",
//                 borderRadius: "20px",
//                 backgroundColor: isDarkMode ? "#10B981" + "30" : "#F0FDF4",
//                 fontFamily: "Tajawal",
//               }}
//             >
//               <img src={teacherIcon} alt="المعلمون" />
//               <Typography sx={{ color: theme.palette.text.secondary }}>المعلمون </Typography>
//               <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
//                 {teachersCount} معلم
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 width: "260px",
//                 height: "160px",
//                 padding: "40px",
//                 margin: "10px",
//                 borderRadius: "20px",
//                 backgroundColor: isDarkMode ? "#F59E0B" + "30" : "#FFF7ED",
//                 fontFamily: "Tajawal",
//               }}
//             >
//               <img src={coursesIcon} alt="الدورات" />
//               <Typography sx={{ color: theme.palette.text.secondary }}>عدد الكورسات</Typography>
//               <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
//                 {coursesCount} كورس
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 width: "260px",
//                 height: "160px",
//                 padding: "40px",
//                 margin: "10px ",
//                 borderRadius: "20px",
//                 backgroundColor: isDarkMode ? theme.palette.secondary.dark + "30" : "#F5F3FF",
//                 fontFamily: "Tajawal",
//               }}
//             >
//               <img src={payments} alt="الإيرادات" />
//               <Typography sx={{ color: theme.palette.text.secondary }}>الإيرادات الكلية</Typography>
//               <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
//                 {totalRevenue} جنيه
//               </Typography>
//             </Box>
//           </Stack>
//         </Box>
//       </Stack>
//   );
// }

import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Stack,
  useTheme,
} from "@mui/material";

import { useThemeMode } from "../../context/ThemeContext";

import coursesIcon from "../../assets/images/book.png";
import teacherIcon from "../../assets/images/board.png";
import studentIcon from "../../assets/images/hatGrad.png";
import payments from "../../assets/images/dollar.png";
import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export default function PrimarySearchAppBar() {
  const [selectedItem, setSelectedItem] = React.useState("Dashboard");
  const [studentsCount, setStudentsCount] = React.useState(0);
  const [teachersCount, setTeachersCount] = React.useState(0);
  const [coursesCount, setCoursesCount] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();

  const navigate = useNavigate();

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      const students = users.filter((user) => user.role === "student");
      const teachers = users.filter(
        (user) => user.role === "teacher" && user.status === "تم القبول"
      );
      console.log("Teachers:", teachers);
      setStudentsCount(students.length);
      setTeachersCount(teachers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function fetchCourses() {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courses = querySnapshot.docs.map((doc) => doc.data());
      setCoursesCount(courses.length);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  async function fetchTotalRevenue() {
    try {
      const querySnapshot = await getDocs(collection(db, "enrollments"));
      const enrollments = querySnapshot.docs.map((doc) => doc.data());
      const total = enrollments.reduce((sum, enrollment) => {
        const price =
          enrollment.price || enrollment.amount || enrollment.totalPrice || 0;
        return (
          sum + (typeof price === "number" ? price : parseFloat(price) || 0)
        );
      }, 0);
      setTotalRevenue(total);
      console.log("Total Revenue:", total);
      console.log("Enrollments:", enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }

  React.useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    fetchData();
    fetchCourses();
    fetchTotalRevenue();
  }, []);

  // Prepare the data for the chart
  const chartData = [
    { name: "الطلاب", value: studentsCount },
    { name: "المعلمون", value: teachersCount },
    { name: "الكورسات", value: coursesCount },
    // { name: "الإيرادات", value: totalRevenue },
  ];

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        fontFamily: "Tajawal",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${
          theme.palette.background.default
        } 0%, ${isDarkMode ? "#0d1117" : "#f0f2f5"} 100%)`,
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          width: "200px",
          backgroundColor: theme.palette.background.paper,
          borderLeft: `1px solid ${theme.palette.divider}`,
          [theme.breakpoints.down("sm")]: {
            width: "100%",
            height: "auto",
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderLeft: "none",
          },
        }}
      >
        <Stack
          sx={{
            [theme.breakpoints.down("sm")]: {
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "10px 0",
            },
          }}
        >
          <AppBar
            position="static"
            sx={{
              backgroundColor: "transparent",
              marginTop: "4%",
              boxShadow: "none",
              textAlign: "center",
              [theme.breakpoints.down("sm")]: {
                marginTop: 0,
              },
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              <img
                src={TopaminIcon}
                alt="توبامين"
                style={{ width: "40px", height: "40px" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    color: theme.palette.text.primary,
                    fontWeight: "700",
                    fontSize: "30",
                    marginLeft: "20px",
                  },
                  [theme.breakpoints.down("sm")]: {
                    display: "none",
                  },
                }}
              >
                توبامين
              </Typography>
            </Toolbar>
          </AppBar>

          <Box
            onClick={() => {
              setSelectedItem("Dashboard");
              navigate("/admin");
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "70px",
              padding: "12% 23%",
              gap: "10%",
              cursor: "pointer",
              backgroundColor:
                selectedItem === "Dashboard"
                  ? theme.palette.primary.main + "20"
                  : "transparent",
              color:
                selectedItem === "Dashboard"
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              transition: "0.3s background-color ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "auto",
                padding: "10px",
                gap: "5px",
                "& img": {
                  width: "20px",
                  height: "20px",
                },
              },
            }}
          >
            <img
              src={dashboardIcon}
              alt="dashboardicon"
              style={{ height: "20px", width: "20px" }}
            />
            <Typography
              sx={{ [theme.breakpoints.down("sm")]: { fontSize: "10px" } }}
            >
              {" "}
              لوحه التحكم
            </Typography>
          </Box>

          <Box
            onClick={() => {
              setSelectedItem("Courses");
              navigate("/Courses");
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "70px",
              padding: "10% 23%",
              gap: "10%",
              cursor: "pointer",
              marginTop: "2%",
              backgroundColor:
                selectedItem === "Courses"
                  ? theme.palette.primary.main + "20"
                  : "transparent",
              color:
                selectedItem === "Courses"
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              transition: "0.3s background-color ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "auto",
                padding: "10px",
                gap: "5px",
                marginTop: "0",
                "& img": {
                  width: "20px",
                  height: "20px",
                },
              },
            }}
          >
            <img
              src={grayCoursesIcon}
              alt="coursesIcon"
              style={{ height: "25px" }}
            />
            <Typography
              sx={{ [theme.breakpoints.down("sm")]: { fontSize: "10px" } }}
            >
              {" "}
              الكورسات
            </Typography>
          </Box>

          <Box
            onClick={() => {
              setSelectedItem("Teachers");
              navigate("/Teachers");
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "70px",
              padding: "10% 23%",
              gap: "10%",
              cursor: "pointer",
              marginTop: "2%",
              backgroundColor:
                selectedItem === "Teachers"
                  ? theme.palette.primary.main + "20"
                  : "transparent",
              color:
                selectedItem === "Teachers"
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              transition: "0.3s background-color ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "auto",
                padding: "10px",
                gap: "5px",
                marginTop: "0",
                "& img": {
                  width: "20px",
                  height: "20px",
                },
              },
            }}
          >
            <img
              src={grayTeachersIcon}
              alt="teachersIcon"
              style={{ height: "25px" }}
            />
            <Typography
              sx={{ [theme.breakpoints.down("sm")]: { fontSize: "10px" } }}
            >
              {" "}
              المعلمون
            </Typography>
          </Box>
          <Box
            onClick={() => {
              setSelectedItem("Students");
              navigate("/Students");
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "70px",
              padding: "10% 23%",
              gap: "10%",
              cursor: "pointer",
              marginTop: "2%",
              backgroundColor:
                selectedItem === "Students"
                  ? theme.palette.primary.main + "20"
                  : "transparent",
              color:
                selectedItem === "Students"
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              transition: "0.3s background-color ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "auto",
                padding: "10px",
                gap: "5px",
                marginTop: "0",
                "& img": {
                  width: "20px",
                  height: "20px",
                },
              },
            }}
          >
            <img
              src={grayStudentsIcon}
              alt="studentIcon"
              style={{ height: "25px" }}
            />
            <Typography
              sx={{ [theme.breakpoints.down("sm")]: { fontSize: "10px" } }}
            >
              {" "}
              الطلاب
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "260px" },
              height: "160px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: isDarkMode
                ? theme.palette.primary.dark + "30"
                : "#F3F4FF",
              fontFamily: "Tajawal",
              boxShadow: theme.shadows[3],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ "& img": { transition: "transform 0.3s ease-in-out" } }}>
              <img src={studentIcon} alt="الطلاب" />
            </Box>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              الطلاب
            </Typography>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              {studentsCount} طالب
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", sm: "260px" },
              height: "160px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: isDarkMode ? "#10B981" + "30" : "#F0FDF4",
              fontFamily: "Tajawal",
              boxShadow: theme.shadows[3],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ "& img": { transition: "transform 0.3s ease-in-out" } }}>
              <img src={teacherIcon} alt="المعلمون" />
            </Box>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              المعلمون
            </Typography>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              {teachersCount} معلم
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", sm: "260px" },
              height: "160px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: isDarkMode ? "#F59E0B" + "30" : "#FFF7ED",
              fontFamily: "Tajawal",
              boxShadow: theme.shadows[3],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ "& img": { transition: "transform 0.3s ease-in-out" } }}>
              <img src={coursesIcon} alt="الدورات" />
            </Box>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              عدد الكورسات
            </Typography>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              {coursesCount} كورس
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", sm: "260px" },
              height: "160px",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: isDarkMode
                ? theme.palette.secondary.dark + "30"
                : "#F5F3FF",
              fontFamily: "Tajawal",
              boxShadow: theme.shadows[3],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ "& img": { transition: "transform 0.3s ease-in-out" } }}>
              <img src={payments} alt="الإيرادات" />
            </Box>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              الإيرادات الكلية
            </Typography>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              {totalRevenue} جنيه
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            width: { xs: "100%", md: "calc(100% - 40px)" },
            height: "400px",
            marginTop: "40px",
            padding: "20px",
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            direction: "ltr",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: "20px",
              color: theme.palette.text.primary,
              textAlign: "center",
            }}
          >
            إحصائيات المنصة
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#8884d8"
                name="العدد"
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Stack>
  );
}

// import * as React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Typography,
//   Toolbar,
//   Box,
//   Stack,
//   useTheme,
// } from "@mui/material";

// import { useThemeMode } from "../../context/ThemeContext";

// import coursesIcon from "../../assets/images/book.png";
// import teacherIcon from "../../assets/images/board.png";
// import studentIcon from "../../assets/images/hatGrad.png";
// import payments from "../../assets/images/dollar.png";
// import dashboardIcon from "../../assets/images/dashboardIcon.png";
// import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
// import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
// import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
// import TopaminIcon from "../../assets/images/Icon-logo.png";

// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function PrimarySearchAppBar() {
//   const [selectedItem, setSelectedItem] = React.useState("Dashboard");
//   const [studentsCount, setStudentsCount] = React.useState(0);
//   const [teachersCount, setTeachersCount] = React.useState(0);
//   const [coursesCount, setCoursesCount] = React.useState(0);
//   const [totalRevenue, setTotalRevenue] = React.useState(0);
//   const { isDarkMode } = useThemeMode();
//   const theme = useTheme();

//   const navigate = useNavigate();

//   async function fetchData() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "users"));

//       const users = querySnapshot.docs.map((doc) => doc.data());

//       const students = users.filter((user) => user.role === "student");
//       const teachers = users.filter(
//         (user) => user.role === "teacher" && user.status === "تم القبول"
//       );
//       console.log("Teachers:", teachers);

//       setStudentsCount(students.length);
//       setTeachersCount(teachers.length);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   }
//   async function fetchCourses() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "courses"));
//       const courses = querySnapshot.docs.map((doc) => doc.data());
//       setCoursesCount(courses.length);
//       console.log("Courses:", courses);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   }

//   async function fetchTotalRevenue() {
//     try {
//       const querySnapshot = await getDocs(collection(db, "enrollments"));
//       const enrollments = querySnapshot.docs.map((doc) => doc.data());
//       const total = enrollments.reduce((sum, enrollment) => {
//         const price =
//           enrollment.price || enrollment.amount || enrollment.totalPrice || 0;
//         return (
//           sum + (typeof price === "number" ? price : parseFloat(price) || 0)
//         );
//       }, 0);
//       setTotalRevenue(total);
//       console.log("Total Revenue:", total);
//       console.log("Enrollments:", enrollments);
//     } catch (error) {
//       console.error("Error fetching enrollments:", error);
//     }
//   }
//   React.useEffect(() => {
//     document.documentElement.lang = "ar";
//     document.documentElement.dir = "rtl";
//     fetchData();
//     fetchCourses();
//     fetchTotalRevenue();
//   }, []);

//   // Prepare the data for the chart
//   const chartData = [
//     { name: "الطلاب", value: studentsCount },
//     { name: "المعلمون", value: teachersCount },
//     { name: "الكورسات", value: coursesCount },
//     { name: "الإيرادات", value: totalRevenue },
//   ];

//   return (
//     <Stack
//       sx={{ display: "flex", flexDirection: "row", fontFamily: "Tajawal" }}
//     >
//              {" "}
//       <Box
//         sx={{
//           width: "200px",
//           backgroundColor: theme.palette.background.paper,
//           borderLeft: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//                  {" "}
//         <Stack>
//                      {" "}
//           <AppBar
//             position="static"
//             sx={{
//               backgroundColor: theme.palette.background.paper,
//               marginTop: "4%",
//               boxShadow: "none",
//               textAlign: "center",
//             }}
//           >
//                          {" "}
//             <Toolbar sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
//                              {" "}
//               <img
//                 src={TopaminIcon}
//                 alt="توبامين"
//                 style={{ width: "40px", height: "40px" }}
//               />
//                              {" "}
//               <Typography
//                 variant="h6"
//                 noWrap
//                 component="div"
//                 sx={{
//                   display: {
//                     xs: "none",
//                     sm: "block",
//                     color: theme.palette.text.primary,
//                     fontWeight: "700",
//                     fontSize: "30",
//                     marginLeft: "20px",
//                   },
//                 }}
//               >
//                                   توبامين                {" "}
//               </Typography>
//                            {" "}
//             </Toolbar>
//                        {" "}
//           </AppBar>
//                      {" "}
//           <Box
//             onClick={() => {
//               setSelectedItem("Dashboard");
//               navigate("/admin");
//             }}
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               height: "70px",
//               padding: "12% 23%",
//               gap: "10%",
//               cursor: "pointer",
//               backgroundColor:
//                 selectedItem === "Dashboard"
//                   ? theme.palette.primary.main + "20"
//                   : "transparent",
//               color:
//                 selectedItem === "Dashboard"
//                   ? theme.palette.primary.main
//                   : theme.palette.text.secondary,
//               transition: "0.3s background-color ease",
//               "&:hover": {
//                 backgroundColor: theme.palette.primary.main + "10",
//               },
//             }}
//           >
//                          {" "}
//             <img
//               src={dashboardIcon}
//               alt="dashboardicon"
//               style={{ height: "20px", width: "20px" }}
//             />
//                           <Typography> لوحه التحكم</Typography>           {" "}
//           </Box>
//                      {" "}
//           <Box
//             onClick={() => {
//               setSelectedItem("Courses");
//               navigate("/Courses");
//             }}
//             sx={{
//               display: "flex",
//               flexDirection: "row",

//               height: "70px",
//               padding: "10% 23%",
//               gap: "10%",
//               cursor: "pointer",
//               marginTop: "2%",

//               backgroundColor:
//                 selectedItem === "Courses"
//                   ? theme.palette.primary.main + "20"
//                   : "transparent",
//               color:
//                 selectedItem === "Courses"
//                   ? theme.palette.primary.main
//                   : theme.palette.text.secondary,
//               transition: "0.3s background-color ease",
//               "&:hover": {
//                 backgroundColor: theme.palette.primary.main + "10",
//               },
//             }}
//           >
//                          {" "}
//             <img
//               src={grayCoursesIcon}
//               alt="coursesIcon"
//               style={{ height: "25px" }}
//             />
//                           <Typography> الكورسات</Typography>           {" "}
//           </Box>
//                      {" "}
//           <Box
//             onClick={() => {
//               setSelectedItem("Teachers");
//               navigate("/Teachers");
//             }}
//             sx={{
//               display: "flex",
//               flexDirection: "row",

//               height: "70px",
//               padding: "10% 23%",
//               gap: "10%",
//               cursor: "pointer",
//               marginTop: "2%",

//               backgroundColor:
//                 selectedItem === "Teachers"
//                   ? theme.palette.primary.main + "20"
//                   : "transparent",
//               color:
//                 selectedItem === "Teachers"
//                   ? theme.palette.primary.main
//                   : theme.palette.text.secondary,
//               transition: "0.3s background-color ease",
//               "&:hover": {
//                 backgroundColor: theme.palette.primary.main + "10",
//               },
//             }}
//           >
//                          {" "}
//             <img
//               src={grayTeachersIcon}
//               alt="teachersIcon"
//               style={{ height: "25px" }}
//             />
//                           <Typography> المعلمون</Typography>           {" "}
//           </Box>
//                      {" "}
//           <Box
//             onClick={() => {
//               setSelectedItem("Students");
//               navigate("/Students");
//             }}
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               height: "70px",
//               padding: "10% 23%",
//               gap: "10%",
//               cursor: "pointer",
//               marginTop: "2%",

//               backgroundColor:
//                 selectedItem === "Students"
//                   ? theme.palette.primary.main + "20"
//                   : "transparent",
//               color:
//                 selectedItem === "Students"
//                   ? theme.palette.primary.main
//                   : theme.palette.text.secondary,
//               transition: "0.3s background-color ease",
//               "&:hover": {
//                 backgroundColor: theme.palette.primary.main + "10",
//               },
//             }}
//           >
//                          {" "}
//             <img
//               src={grayStudentsIcon}
//               alt="studentIcon"
//               style={{ height: "25px" }}
//             />
//                           <Typography> الطلاب</Typography>           {" "}
//           </Box>
//                              {" "}
//         </Stack>
//                {" "}
//       </Box>
//              {" "}
//       <Box
//         sx={{
//           flexGrow: 1,
//           backgroundColor: theme.palette.background.default,
//           minHeight: "100vh",
//           borderRight: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//                            {" "}
//         <Stack sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
//                      {" "}
//           <Box
//             sx={{
//               width: "260px",
//               height: "160px",
//               padding: "40px",
//               margin: "10px ",
//               borderRadius: "20px",
//               backgroundColor: isDarkMode
//                 ? theme.palette.primary.dark + "30"
//                 : "#F3F4FF",
//               fontFamily: "Tajawal",
//             }}
//           >
//                           <img src={studentIcon} alt="الطلاب" />             {" "}
//             <Typography sx={{ color: theme.palette.text.secondary }}>
//               الطلاب{" "}
//             </Typography>
//                          {" "}
//             <Typography
//               sx={{
//                 fontSize: "30px",
//                 fontWeight: "bold",
//                 color: theme.palette.text.primary,
//               }}
//             >
//                               {studentsCount} طالب              {" "}
//             </Typography>
//                        {" "}
//           </Box>
//                      {" "}
//           <Box
//             sx={{
//               width: "260px",
//               height: "160px",
//               padding: "40px",
//               margin: "10px",
//               borderRadius: "20px",
//               backgroundColor: isDarkMode ? "#10B981" + "30" : "#F0FDF4",
//               fontFamily: "Tajawal",
//             }}
//           >
//                           <img src={teacherIcon} alt="المعلمون" />             {" "}
//             <Typography sx={{ color: theme.palette.text.secondary }}>
//               المعلمون{" "}
//             </Typography>
//                          {" "}
//             <Typography
//               sx={{
//                 fontSize: "30px",
//                 fontWeight: "bold",
//                 color: theme.palette.text.primary,
//               }}
//             >
//                               {teachersCount} معلم              {" "}
//             </Typography>
//                        {" "}
//           </Box>
//                      {" "}
//           <Box
//             sx={{
//               width: "260px",
//               height: "160px",
//               padding: "40px",
//               margin: "10px",
//               borderRadius: "20px",
//               backgroundColor: isDarkMode ? "#F59E0B" + "30" : "#FFF7ED",
//               fontFamily: "Tajawal",
//             }}
//           >
//                           <img src={coursesIcon} alt="الدورات" />             {" "}
//             <Typography sx={{ color: theme.palette.text.secondary }}>
//               عدد الكورسات
//             </Typography>
//                          {" "}
//             <Typography
//               sx={{
//                 fontSize: "30px",
//                 fontWeight: "bold",
//                 color: theme.palette.text.primary,
//               }}
//             >
//                               {coursesCount} كورس              {" "}
//             </Typography>
//                        {" "}
//           </Box>
//                      {" "}
//           <Box
//             sx={{
//               width: "260px",
//               height: "160px",
//               padding: "40px",
//               margin: "10px ",
//               borderRadius: "20px",
//               backgroundColor: isDarkMode
//                 ? theme.palette.secondary.dark + "30"
//                 : "#F5F3FF",
//               fontFamily: "Tajawal",
//             }}
//           >
//                           <img src={payments} alt="الإيرادات" />             {" "}
//             <Typography sx={{ color: theme.palette.text.secondary }}>
//               الإيرادات الكلية
//             </Typography>
//                          {" "}
//             <Typography
//               sx={{
//                 fontSize: "30px",
//                 fontWeight: "bold",
//                 color: theme.palette.text.primary,
//               }}
//             >
//                               {totalRevenue} جنيه              {" "}
//             </Typography>
//                        {" "}
//           </Box>
//                    {" "}
//         </Stack>
//         {/* New section for the dynamic chart */}
//         <Box
//           sx={{
//             width: "calc(100% - 40px)",
//             height: "400px",
//             margin: "20px",
//             padding: "20px",
//             borderRadius: "20px",
//             backgroundColor: theme.palette.background.paper,
//             boxShadow: theme.shadows[1],
//             direction: "ltr", // Recharts works better with LTR
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               marginBottom: "20px",
//               color: theme.palette.text.primary,
//               textAlign: "center",
//             }}
//           >
//             إحصائيات المنصة
//           </Typography>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={chartData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" fill="#8884d8" name="العدد" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>
//                {" "}
//       </Box>
//            {" "}
//     </Stack>
//   );
// }
