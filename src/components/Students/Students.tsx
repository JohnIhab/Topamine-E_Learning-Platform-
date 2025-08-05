import React from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Stack,
  TextField,
  Autocomplete,
  
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";


import SearchIcon from "@mui/icons-material/search";
import InputAdornment from "@mui/material/InputAdornment";

import blockIcon from "../../assets/images/blockIcon.png";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  // Button,
  Avatar,
  // Chip,
  LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { collection, getDocs,deleteDoc,doc } from "firebase/firestore";
import { db } from '../../firebase';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade?: string;
  governorate?: string;
  phone?: string;
  createdAt?: any;
  role: string;
  
}

interface Course {
  id: string;
  title: string;
  subTitle: string;
  teacherName: string;
  price: number;
  gradeLevel: string;
  term: string;
 
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  // enrollmentDate: any;
 timestamp:any;
  userEmail: string;
  // status: 'active' | 'completed' | 'cancelled';
  progress: number;
  student?: Student;
  course?: Course;
}

export default function PrimarySearchAppBar() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [success, setSuccess] = useState(false);
const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function fetchData() {
    try {
      setLoading(true);
      
      const [studentsQuery, coursesQuery, enrollmentsQuery] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "courses")),
        getDocs(collection(db, "enrollments")),
      ]);

      const studentsData = studentsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter((user: any) => user.role === "student") as Student[];

      const coursesData = coursesQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      const enrollmentsData = enrollmentsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[];

      const enrichedEnrollments = enrollmentsData.map((enrollment) => {
       const student = studentsData.find(s => s.id === enrollment.userId);
        const course = coursesData.find(c => c.id === enrollment.courseId);
        return {
          ...enrollment,
          student,
          course,
        };
      });

      setEnrollments(enrichedEnrollments);
      setStudentsData(studentsData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!searchValue) return true;
    
    const searchLower = searchValue.toLowerCase();
    return (
      enrollment.student?.name?.toLowerCase().includes(searchLower) ||
      enrollment.student?.email?.toLowerCase().includes(searchLower) ||
      enrollment.course?.title?.toLowerCase().includes(searchLower) ||
      enrollment.course?.teacherName?.toLowerCase().includes(searchLower)
    );
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active': return 'primary';
  //     case 'completed': return 'success';
  //     case 'cancelled': return 'error';
  //     default: return 'default';
  //   }
  // };

 const handleDelete = async (id: string) => {
  if (window.confirm('هل أنت متأكد من حذف الطالب؟')) {
    try {
      await deleteDoc(doc(db, 'users', id));
      toast.success('تم حذف الطالب بنجاح', {
        position: "top-left",
        autoClose: 2000,
      });

      setStudentsData(prev => prev.filter(student => student.id !== id)); 
      setSuccess(true);
    } catch (err) {
      setError(true);
      console.error('حدث خطأ أثناء حذف الطالب:', err);
    }
  }
};

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(157, 180, 206, 0.57)",
            boxShadow: "none",
            padding: "0.5%",
            width:'75vw',
            mx:"auto",
            borderRadius: "20px"
          }}
        >
          <Toolbar>
            <Typography
              noWrap
              component="div"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                  fontWeight: "600",
                  fontSize: "20px",
                  color: "#111827",
                },
              }}
            >
              إدارة الطلاب المسجلين
            </Typography>
          </Toolbar>
        </AppBar>

        <TableContainer
          component={Paper}
          sx={{ mt: 4, borderRadius: "20px", margin: "2%", width: "96%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "43%",
              padding: "2%",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              الطلاب المسجلين في الكورسات
            </Typography>
            <Stack
              spacing={2}
              sx={{
                width: 300,
              }}
            >
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={enrollments.map((enrollment) => enrollment.student?.name || "")}
                onInputChange={(_event, newInputValue) => {
                  setSearchValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="ابحث عن طالب  ..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "gray" }} />
                        </InputAdornment>
                      ),
                      inputProps: {
                        ...params.inputProps,
                        type: "search",
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "50px",
                        borderRadius: "10px",
                        border: "1px solid rgba(134, 145, 160, 0.57)",
                        color: "#4F46E5",
                        paddingX: 1,
                      },
                      "& .MuiInputBase-input": {
                        color: "gray",
                      },
                      "& .MuiInputLabel-root": {
                        color: "gray",
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  الطالب
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  الايميل
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  الكورس المسجل
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  المدرس
                </TableCell>
                 <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  المستوى الدراسي
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  المحافظة
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  تاريخ التسجيل
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  الاجراءات
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    لا يوجد طلاب مسجلين في الكورسات
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((enrollment, index) => (
                  <TableRow key={enrollment.id || index}>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                        <Avatar 
                          src={enrollment.student?.avatar} 
                          sx={{ width: 32, height: 32 }}
                        >
                          {enrollment.student?.name?.charAt(0) || ''}
                        </Avatar>
                        <Typography variant="body2">
                          {enrollment.student?.name || 'غير محدد'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.student?.email || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {enrollment.course?.title || 'غير محدد'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {enrollment.course?.subTitle || ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.course?.teacherName || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.course?.gradeLevel || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={enrollment.progress || 0}
                          color={getProgressColor(enrollment.progress || 0)}
                          sx={{ width: "100%", height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption">
                          {enrollment.progress || 0}%
                        </Typography>
                       
                      </Box> */}
                       <Typography>
                          {enrollment.student?.governorate || 'غير محدد'}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.timestamp && typeof enrollment.timestamp.toDate === 'function'
                        ? enrollment.timestamp.toDate().toLocaleDateString('ar-EG')
                        : enrollment.timestamp instanceof Date
                        ? enrollment.timestamp.toLocaleDateString('ar-EG')
                        : 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      <img src={blockIcon} alt="Block" style={{ cursor: "pointer" }} onClick={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}




// StudentInfo.tsx
// import React, { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../firebase';
// // import React from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   AppBar,
//   Typography,
//   Toolbar,
//   Box,
//   Stack,
//   TextField,
//   Autocomplete,
  
// } from "@mui/material";

// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../../../theme";


// import SearchIcon from "@mui/icons-material/search";
// import InputAdornment from "@mui/material/InputAdornment";

// import blockIcon from "../../assets/images/blockIcon.png";

// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   // Button,
//   Avatar,
//   // Chip,
//   LinearProgress,
// } from "@mui/material";
// // import { useState, useEffect } from "react";
// // import { collection, getDocs } from "firebase/firestore";
// // import { db } from '../../firebase';

// interface Student {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   grade?: string;
//   governorate?: string;
//   phone?: string;
//   createdAt?: any;
//   role: string;
// }

// const StudentInfo = ({ studentId }: { studentId: string }) => {
//   const [student, setStudent] = useState<any>(null);

//   useEffect(() => {
//     const fetchStudent = async () => {
//       try {
//         const docRef = doc(db, 'users', studentId);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setStudent(docSnap.data());
//         } else {
//           console.log('No such document!');
//         }
//       } catch (error) {
//         console.error('Error fetching student:', error);
//       }
//     };

//     if (studentId) fetchStudent();
//   }, [studentId]);

//   return (
//     <ThemeProvider theme={theme}>
  
      
      
//        <Box
//           sx={{
//             flexGrow: 1,
//             // backgroundColor: "#eeeeee",
//             minHeight: "100vh",
//             // borderRight: "1px solid rgba(157, 180, 206, 0.57)",
//           }}
//         >
        
//           <AppBar
//             position="static"
//             sx={{
//               backgroundColor: "#FFFFFF",
//               borderBottom: "1px solid rgba(157, 180, 206, 0.57)",
//               boxShadow: "none",
//               padding: "0.5%",
//               width:'75vw',
//               mx:"auto",
//               borderRadius: "20px"

//             }}
//           >
//             <Toolbar>
//               <Typography
//                 noWrap
//                 component="div"
//                 sx={{
//                   display: {
//                     xs: "none",
//                     sm: "block",
//                     fontWeight: "600",
//                     fontSize: "20px",
//                     color: "#111827",
//                   },
//                 }}
//               >
//                 إدارة الطلاب المسجلين
//               </Typography>
//             </Toolbar>
//           </AppBar>

        

//           <TableContainer
//             component={Paper}
//             sx={{ mt: 4, borderRadius: "20px", margin: "2%", width: "96%" }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: "43%",
//                 padding: "2%",
//               }}
//             >
//               <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
//                 الطلاب المسجلين في الكورسات
//               </Typography>
//               <Stack
//                 spacing={2}
//                 sx={{
//                   width: 300,
//                 }}
//               >
//                 <Autocomplete
//                   freeSolo
//                   id="free-solo-2-demo"
//                   disableClearable
//                   options={enrollments.map((enrollment) => enrollment.student?.name || "")}
//                   onInputChange={(_event, newInputValue) => {
//                     setSearchValue(newInputValue);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       placeholder="ابحث عن طالب  ..."
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon sx={{ color: "gray" }} />
//                           </InputAdornment>
//                         ),
//                         inputProps: {
//                           ...params.inputProps,
//                           type: "search",
//                         },
//                       }}
//                       sx={{
//                         "& .MuiInputBase-root": {
//                           height: "50px",
//                           borderRadius: "10px",
//                           border: "1px solid rgba(134, 145, 160, 0.57)",
//                           color: "#4F46E5",
//                           paddingX: 1,
//                         },
//                         "& .MuiInputBase-input": {
//                           color: "gray",
//                         },
//                         "& .MuiInputLabel-root": {
//                           color: "gray",
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </Stack>
//             </Box>

//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     الطالب
//                   </TableCell>
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     الايميل
//                   </TableCell>
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     الكورس المسجل
//                   </TableCell>
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     المدرس
//                   </TableCell>
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     التقدم
//                   </TableCell>
                 
//                   <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                     الاجراءات
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
//                       جاري التحميل...
//                     </TableCell>
//                   </TableRow>
//                 ) : filteredEnrollments.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
//                       لا يوجد طلاب مسجلين في الكورسات
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredEnrollments.map((enrollment, index) => (
//                     <TableRow key={enrollment.id || index}>
//                       <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
//                           <Avatar 
//                             src={enrollment.student?.avatar} 
//                             sx={{ width: 32, height: 32 }}
//                           >
//                             {enrollment.student?.name?.charAt(0) || ''}
//                           </Avatar>
//                           <Typography variant="body2">
//                             {enrollment.student?.name || 'غير محدد'}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                         {enrollment.student?.email || 'غير محدد'}
//                       </TableCell>
//                       <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                         <Typography variant="body2" fontWeight="bold">
//                           {enrollment.course?.title || 'غير محدد'}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {enrollment.course?.subTitle || ''}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                         {enrollment.course?.teacherName || 'غير محدد'}
//                       </TableCell>
//                       <TableCell sx={{ width: "15%", textAlign: "center" }}>
//                         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
//                           <LinearProgress
//                             variant="determinate"
//                             value={enrollment.progress || 0}
//                             color={getProgressColor(enrollment.progress || 0)}
//                             sx={{ width: "100%", height: 8, borderRadius: 4 }}
//                           />
//                           <Typography variant="caption">
//                             {enrollment.progress || 0}%
//                           </Typography>
//                         </Box>
//                       </TableCell>
                     
//                       <TableCell sx={{ width: "10%", textAlign: "center" }}>
//                         {enrollment.enrollmentDate && typeof enrollment.enrollmentDate.toDate === 'function'
//                           ? enrollment.enrollmentDate.toDate().toLocaleDateString('ar-EG')
//                           : enrollment.enrollmentDate instanceof Date
//                           ? enrollment.enrollmentDate.toLocaleDateString('ar-EG')
//                           : 'غير محدد'}
//                       </TableCell>
//                       <TableCell sx={{ width: "5%", textAlign: "center" }}>
//                         <img src={blockIcon} alt="Block" style={{ cursor: "pointer" }} />
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
       
//         </Box>
//       {/* </Stack> */}
//     </ThemeProvider>
//   );
// };

// export default StudentInfo;

