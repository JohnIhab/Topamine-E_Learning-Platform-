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


import SearchIcon from '@mui/icons-material/Search';
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
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { collection, getDocs,deleteDoc,doc } from "firebase/firestore";
// @ts-ignore
import { db } from '../../firebase';
import { toast } from 'react-toastify';
// @ts-ignore
import { useAuth } from '../../context/AuthContext';

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
  id: string;
  studentId?: string;
  uid?: string;
  courseId: string;
  timestamp: any;
  amount: number;
  status?: string;
  paid?: boolean;
  student?: Student;
  course?: Course;
}

export default function PrimarySearchAppBar() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, role }: any = useAuth();

  async function fetchData() {
    try {
      setLoading(true);
      
      if (!user?.uid || role !== 'teacher') {
        console.log('No teacher user found or user is not a teacher');
        setLoading(false);
        return;
      }

      const [studentsQuery, coursesQuery, paymentsQuery] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "courses")),
        getDocs(collection(db, "payments")),
      ]);

      const studentsData = studentsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter((user: any) => user.role === "student") as Student[];

      const coursesData = coursesQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      const teacherCourses = coursesData.filter(course => course.teacherId === user.uid);
      const teacherCourseIds = teacherCourses.map(course => course.id);

      const paymentsData = paymentsQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      const teacherPayments = paymentsData.filter(payment => 
        teacherCourseIds.includes(payment.courseId)
      );

      const enrichedPayments = teacherPayments.map((payment) => {
        const studentId = payment.studentId || payment.uid;
        const student = studentsData.find(s => s.id === studentId);
        const course = teacherCourses.find(c => c.id === payment.courseId);
        return {
          ...payment,
          student,
          course,
        };
      });

      setPayments(enrichedPayments);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('حدث خطأ في جلب البيانات', {
        position: "top-left",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user, role]);

  const filteredPayments = payments.filter((payment) => {
    if (!searchValue) return true;
    
    const searchLower = searchValue.toLowerCase();
    return (
      payment.student?.name?.toLowerCase().includes(searchLower) ||
      payment.student?.email?.toLowerCase().includes(searchLower) ||
      payment.course?.title?.toLowerCase().includes(searchLower) ||
      payment.course?.teacherName?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate unique students count
  const uniqueStudentsCount = new Set(
    filteredPayments
      .map(payment => payment.student?.id)
      .filter(id => id)
  ).size;



const handleDelete = async (id: string) => {
  if (window.confirm('هل أنت متأكد من حذف سجل الدفع؟')) {
    try {
      const paymentToDelete = payments.find(p => p.id === id || p.student?.id === id);
      if (!paymentToDelete) {
        toast.error('لم يتم العثور على سجل الدفع', {
          position: "top-left",
          autoClose: 2000,
        });
        return;
      }

      await deleteDoc(doc(db, 'payments', paymentToDelete.id));
      toast.success('تم حذف سجل الدفع بنجاح', {
        position: "top-left",
        autoClose: 2000,
      });

      setPayments(prev => prev.filter(payment => payment.id !== paymentToDelete.id)); 
    } catch (err) {
      console.error('حدث خطأ أثناء حذف سجل الدفع:', err);
      toast.error('حدث خطأ أثناء حذف سجل الدفع', {
        position: "top-left",
        autoClose: 2000,
      });
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
        {/* <AppBar
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
              إدارة طلابي الذين دفعوا
            </Typography>
          </Toolbar>
        </AppBar> */}

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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
                طلابي الذين دفعوا لكورساتي
              </Typography>
              <Box sx={{ display: "flex", gap: 2, px: 2 }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    fontWeight: "600",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "8px",
                    padding: "8px 16px",
                  }}
                >
                  اجمالى الطلاب: {uniqueStudentsCount}
                </Typography>
                
              </Box>
            </Box>
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
                options={payments.map((payment) => payment.student?.name || "")}
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
                <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  الطالب
                </TableCell>
                <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  الايميل
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  الكورس المدفوع
                </TableCell>
                <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  المدرس
                </TableCell>
                <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  المبلغ المدفوع
                </TableCell>
                 <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  المستوى الدراسي
                </TableCell>
                <TableCell sx={{ width: "12%", textAlign: "center" }}>
                  المحافظة
                </TableCell>
                <TableCell sx={{ width: "13%", textAlign: "center" }}>
                  تاريخ الدفع
                </TableCell>
                <TableCell sx={{ width: "10%", textAlign: "center" }}>
                  الاجراءات
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : !user || role !== 'teacher' ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    يجب أن تكون مدرساً لعرض هذه البيانات
                  </TableCell>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    لا يوجد طلاب دفعوا لكورساتك بعد
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment, index) => (
                  <TableRow key={payment.id || index}>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                        <Avatar 
                          src={payment.student?.avatar} 
                          sx={{ width: 32, height: 32 }}
                        >
                          {payment.student?.name?.charAt(0) || ''}
                        </Avatar>
                        <Typography variant="body2">
                          {payment.student?.name || 'غير محدد'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                      {payment.student?.email || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {payment.course?.title || 'غير محدد'}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                        {payment.course?.subTitle || ''}
                      </Typography> */}
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                      {payment.course?.teacherName || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {payment.amount ? `${payment.amount.toLocaleString()} جنيه` : 'غير محدد'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                      {payment.course?.gradeLevel || 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center" }}>
                    <Typography>
                          {payment.student?.governorate || 'غير محدد'}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "13%", textAlign: "center" }}>
                      {payment.timestamp && typeof payment.timestamp.toDate === 'function'
                        ? payment.timestamp.toDate().toLocaleDateString('ar-EG')
                        : payment.timestamp instanceof Date
                        ? payment.timestamp.toLocaleDateString('ar-EG')
                        : 'غير محدد'}
                    </TableCell>
                    <TableCell sx={{ width: "10%", textAlign: "center" }}>
                      <img 
                        src={blockIcon} 
                        alt="Block" 
                        style={{ cursor: "pointer" }} 
                        onClick={() => handleDelete(payment.student?.id || payment.id)} 
                      />
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
