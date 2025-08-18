// import {
//   Typography,
//   Box,
//   Stack,
//   TextField,
//   Autocomplete,

// } from "@mui/material";

// import { useTheme } from "@mui/material/styles";
// import { useThemeMode } from "../../context/ThemeContext";


// import SearchIcon from '@mui/icons-material/Search';
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
//   Avatar,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// // @ts-ignore
// import { db } from '../../firebase';
// import { toast } from 'react-toastify';
// import { useAuth } from '../../context/AuthContext';
// import Loading from "../Loading/Loading";

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

// interface Course {
//   id: string;
//   title: string;
//   subTitle: string;
//   teacherName: string;
//   teacherId: string;
//   price: number;
//   gradeLevel: string;
//   term: string;

// }

// interface Payment {
//   id: string;
//   studentId?: string;
//   uid?: string;
//   courseId: string;
//   timestamp: any;
//   amount: number;
//   status?: string;
//   paid?: boolean;
//   student?: Student;
//   course?: Course;
// }

// export default function PrimarySearchAppBar() {
//   const [enrollments, setenrollments] = useState<Payment[]>([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [loading, setLoading] = useState(true);
//   const { user, role }: any = useAuth();
//   const theme = useTheme();
//   const { isDarkMode } = useThemeMode();

//   async function fetchData() {
//     try {
//       setLoading(true);

//       if (!user?.uid || role !== 'teacher') {
//         console.log('No teacher user found or user is not a teacher');
//         setLoading(false);
//         return;
//       }

//       const [studentsQuery, coursesQuery, enrollmentsQuery] = await Promise.all([
//         getDocs(collection(db, "users")),
//         getDocs(collection(db, "courses")),
//         getDocs(collection(db, "enrollments")),
//       ]);

//       const studentsData = studentsQuery.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })).filter((user: any) => user.role === "student") as Student[];

//       const coursesData = coursesQuery.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Course[];

//       const teacherCourses = coursesData.filter(course => course.teacherId === user.uid);
//       const teacherCourseIds = teacherCourses.map(course => course.id);

//       const enrollmentsData = enrollmentsQuery.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Payment[];

//       const teacherenrollments = enrollmentsData.filter(payment =>
//         teacherCourseIds.includes(payment.courseId)
//       );

//       const enrichedenrollments = teacherenrollments.map((payment) => {
//         const studentId = payment.studentId || payment.uid;
//         const student = studentsData.find(s => s.id === studentId);
//         const course = teacherCourses.find(c => c.id === payment.courseId);
//         return {
//           ...payment,
//           student,
//           course,
//         };
//       });

//       setenrollments(enrichedenrollments);

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error('حدث خطأ في جلب البيانات', {
//         position: "top-left",
//         autoClose: 2000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, [user, role]);

//   const filteredenrollments = enrollments.filter((payment) => {
//     if (!searchValue) return true;

//     const searchLower = searchValue.toLowerCase();
//     return (
//       payment.student?.name?.toLowerCase().includes(searchLower) ||
//       payment.student?.email?.toLowerCase().includes(searchLower) ||
//       payment.course?.title?.toLowerCase().includes(searchLower) ||
//       payment.course?.teacherName?.toLowerCase().includes(searchLower)
//     );
//   });

//   const uniqueStudentsCount = new Set(
//     filteredenrollments
//       .map(payment => payment.student?.id)
//       .filter(id => id)
//   ).size;



//   const handleDelete = async (id: string) => {
//     if (window.confirm('هل أنت متأكد من حذف سجل الدفع؟')) {
//       try {
//         const paymentToDelete = enrollments.find(p => p.id === id || p.student?.id === id);
//         if (!paymentToDelete) {
//           toast.error('لم يتم العثور على سجل الدفع', {
//             position: "top-left",
//             autoClose: 2000,
//           });
//           return;
//         }

//         await deleteDoc(doc(db, 'enrollments', paymentToDelete.id));
//         toast.success('تم حذف سجل الدفع بنجاح', {
//           position: "top-left",
//           autoClose: 2000,
//         });

//         setenrollments(prev => prev.filter(payment => payment.id !== paymentToDelete.id));
//       } catch (err) {
//         console.error('حدث خطأ أثناء حذف سجل الدفع:', err);
//         toast.error('حدث خطأ أثناء حذف سجل الدفع', {
//           position: "top-left",
//           autoClose: 2000,
//         });
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         minHeight: "100vh",
//         backgroundColor: theme.palette.background.default,
//       }}
//     >


//       <TableContainer
//         component={Paper}
//         sx={{
//           mt: 4,
//           borderRadius: "20px",
//           margin: "2%",
//           width: "96%",
//           backgroundColor: theme.palette.background.paper,
//           color: theme.palette.text.primary
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             gap: "43%",
//             padding: "2%",
//           }}
//         >
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//             <Typography variant="h6" fontWeight="bold" sx={{
//               p: 2,
//               color: theme.palette.text.primary
//             }}>
//               طلابي الذين دفعوا لكورساتي
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, px: 2 }}>
//               <Typography
//                 variant="body2"
//                 color="primary"
//                 sx={{
//                   fontWeight: "600",
//                   backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.15)" : "#e3f2fd",
//                   borderRadius: "8px",
//                   padding: "8px 16px",
//                 }}
//               >
//                 اجمالى الطلاب: {uniqueStudentsCount}
//               </Typography>

//             </Box>
//           </Box>
//           <Stack
//             spacing={2}
//             sx={{
//               width: 300,
//             }}
//           >
//             <Autocomplete
//               freeSolo
//               id="free-solo-2-demo"
//               disableClearable
//               options={enrollments.map((payment) => payment.student?.name || "")}
//               onInputChange={(_event, newInputValue) => {
//                 setSearchValue(newInputValue);
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="ابحث عن طالب  ..."
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon sx={{ color: theme.palette.text.secondary }} />
//                       </InputAdornment>
//                     ),
//                     inputProps: {
//                       ...params.inputProps,
//                       type: "search",
//                     },
//                   }}
//                   sx={{
//                     "& .MuiInputBase-root": {
//                       height: "50px",
//                       borderRadius: "10px",
//                       border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(134, 145, 160, 0.57)'}`,
//                       color: theme.palette.primary.main,
//                       paddingX: 1,
//                       backgroundColor: theme.palette.background.paper,
//                     },
//                     "& .MuiInputBase-input": {
//                       color: theme.palette.text.primary,
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: theme.palette.text.secondary,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Stack>
//         </Box>

//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.8)' }}>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 الطالب
//               </TableCell>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 الايميل
//               </TableCell>
//               <TableCell sx={{
//                 width: "15%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 الكورس المدفوع
//               </TableCell>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 المدرس
//               </TableCell>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 المبلغ المدفوع
//               </TableCell>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 المستوى الدراسي
//               </TableCell>
//               <TableCell sx={{
//                 width: "12%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 المحافظة
//               </TableCell>
//               <TableCell sx={{
//                 width: "13%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 تاريخ الدفع
//               </TableCell>
//               <TableCell sx={{
//                 width: "10%",
//                 textAlign: "center",
//                 color: theme.palette.text.primary,
//                 fontWeight: 'bold'
//               }}>
//                 الاجراءات
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={9} sx={{
//                   textAlign: "center",
//                   py: 4,
//                   color: theme.palette.text.primary
//                 }}>
//                   <Loading />
//                 </TableCell>
//               </TableRow>
//             ) : !user || role !== 'teacher' ? (
//               <TableRow>
//                 <TableCell colSpan={9} sx={{
//                   textAlign: "center",
//                   py: 4,
//                   color: theme.palette.text.primary
//                 }}>
//                   يجب أن تكون مدرساً لعرض هذه البيانات
//                 </TableCell>
//               </TableRow>
//             ) : filteredenrollments.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={9} sx={{
//                   textAlign: "center",
//                   py: 4,
//                   color: theme.palette.text.primary
//                 }}>
//                   لا يوجد طلاب دفعوا لكورساتك بعد
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredenrollments.map((payment, index) => (
//                 <TableRow key={payment.id || index} sx={{
//                   '&:hover': {
//                     backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(0, 0, 0, 0.04)',
//                   }
//                 }}>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
//                       <Avatar
//                         src={payment.student?.avatar}
//                         sx={{ width: 32, height: 32 }}
//                       >
//                         {payment.student?.name?.charAt(0) || ''}
//                       </Avatar>
//                       <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
//                         {payment.student?.name || 'غير محدد'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     {payment.student?.email || 'غير محدد'}
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "15%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     <Typography variant="body2" fontWeight="bold" sx={{
//                       color: theme.palette.text.primary, display: '-webkit-box',
//                       WebkitBoxOrient: 'vertical',
//                       WebkitLineClamp: 1,
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                     }}>
//                       {payment.course?.title || 'غير محدد'}
//                     </Typography>

//                   </TableCell>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     {payment.course?.teacherName || 'غير محدد'}
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     <Typography variant="body2" fontWeight="bold" color="primary">
//                       {payment.amount ? `${payment.amount.toLocaleString()} جنيه` : 'غير محدد'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     {payment.course?.gradeLevel || 'غير محدد'}
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "12%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     <Typography sx={{ color: theme.palette.text.primary }}>
//                       {payment.student?.governorate || 'غير محدد'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "13%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     {payment.timestamp && typeof payment.timestamp.toDate === 'function'
//                       ? payment.timestamp.toDate().toLocaleDateString('ar-EG')
//                       : payment.timestamp instanceof Date
//                         ? payment.timestamp.toLocaleDateString('ar-EG')
//                         : 'غير محدد'}
//                   </TableCell>
//                   <TableCell sx={{
//                     width: "10%",
//                     textAlign: "center",
//                     color: theme.palette.text.primary
//                   }}>
//                     <img
//                       src={blockIcon}
//                       alt="Block"
//                       style={{
//                         cursor: "pointer",
//                         filter: isDarkMode ? 'brightness(0.8)' : 'none'
//                       }}
//                       onClick={() => handleDelete(payment.student?.id || payment.id)}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }





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


import SearchIcon from "@mui/icons-material/Search";
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
import { db,auth } from '../../firebase';
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
  teacherId: string;
  price: number;
  gradeLevel: string;
  term: string;
}

interface Payment {
  studentId?: string;
  id: string;
  uid?: string;
  amount: number;
  paid?: boolean;
  timestamp?: any;
  courseId: string;
  student?: Student;  
  course?: Course;    
  studentName?: string;
  studentEmail?: string;
  userName?: string;
  userEmail?: string;
}


export default function PrimarySearchAppBar() {
  const [enrollments, setEnrollments] = useState<Payment[]>([]);
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

      console.log("=== STUDENTS DATA DEBUG ===");
      console.log("Total students found:", studentsData.length);
      console.log("Student IDs:", studentsData.map(s => ({ id: s.id, name: s.name, email: s.email })));
      console.log("Looking for student UID: wvr1NJ3Ec3cfZLrsaDKABFo1AeB3");
      const targetStudent = studentsData.find(s => s.id === 'wvr1NJ3Ec3cfZLrsaDKABFo1AeB3');
      console.log("Target student found:", targetStudent);
      console.log("===========================");

      const coursesData = coursesQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      const enrollmentsData = enrollmentsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      const enrichedEnrollments = enrollmentsData.map((enrollment) => {

        let student = studentsData.find(s => s.id === enrollment.studentId || s.id === enrollment.uid);

        if (!student && (enrollment.userName || enrollment.userEmail || enrollment.studentName || enrollment.studentEmail)) {
          student = {
            id: enrollment.uid || enrollment.studentId || enrollment.id,
            name: enrollment.userName || enrollment.studentName,
            email: enrollment.userEmail || enrollment.studentEmail,
            role: 'student'
          } as Student;
        }

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

  const currentTeacherId = auth.currentUser?.uid;

  if (!currentTeacherId) {
    return <div>جاري التحميل...</div>;
  }

  const teacherEnrollments = enrollments.filter(
    (enrollment) => enrollment.course?.teacherId === currentTeacherId
  );

  console.log("=== TEACHER DASHBOARD ENROLLMENTS DEBUG ===");
  console.log("Current teacher ID:", currentTeacherId);
  console.log("All enrollments:", enrollments.length);
  console.log("Teacher enrollments:", teacherEnrollments.length);

  console.log("=== STUDENTS DATA DEBUG (INLINE) ===");
  console.log("Total students found:", studentsData.length);
  console.log("Student IDs:", studentsData.map(s => ({ id: s.id, name: s.name, email: s.email })));
  console.log("Looking for student UID: wvr1NJ3Ec3cfZLrsaDKABFo1AeB3");
  const targetStudent = studentsData.find(s => s.id === 'wvr1NJ3Ec3cfZLrsaDKABFo1AeB3');
  console.log("Target student found:", targetStudent);
  console.log("=====================================");
  

  teacherEnrollments.forEach((enrollment, index) => {
    console.log(`Enrollment ${index + 1}:`, {
      id: enrollment.id,
      uid: enrollment.uid,
      studentId: enrollment.studentId,
      studentName: enrollment.studentName,
      studentEmail: enrollment.studentEmail,
      actualStudentFound: !!enrollment.student,
      actualStudentName: enrollment.student?.name,
      actualStudentEmail: enrollment.student?.email,
      courseId: enrollment.courseId,
      timestamp: enrollment.timestamp
    });
  });
  
  console.log("========================================");

  const filteredEnrollments = teacherEnrollments.filter((enrollment) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      enrollment.student?.name?.toLowerCase().includes(searchLower) ||
      enrollment.student?.email?.toLowerCase().includes(searchLower) ||
      enrollment.course?.title?.toLowerCase().includes(searchLower) ||
      enrollment.course?.teacherName?.toLowerCase().includes(searchLower)
    );
  });






const handleDelete = async (id: string) => {
  if (window.confirm('هل أنت متأكد من حذف الطالب؟')) {
    try {
      await deleteDoc(doc(db, 'enrollments', id));

      setEnrollments(prev => prev.filter(enrollment => enrollment.id !== id));

      toast.success('تم حذف الطالب بنجاح', {
        position: "top-left",
        autoClose: 2000,
      });

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
                        />
                          {/* <TableCell sx={{ width: "15%", textAlign: "center" }}> */}
                      {enrollment.student?.name || "طالب غير محدد"}
                    {/* </TableCell> */}
                      </Box>
                    </TableCell>
                    {/* <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {payment.student?.name || "طالب غير محدد"}
                    </TableCell> */}
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.student?.email || "بريد إلكتروني غير محدد"}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {enrollment.course?.title || 'غير محدد'}
                      </Typography>
                      
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.course?.teacherName || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      {enrollment.course?.gradeLevel || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>

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
                      <img src={blockIcon} alt="Block" style={{ cursor: "pointer" }} onClick={() => handleDelete(enrollment.id)} />
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