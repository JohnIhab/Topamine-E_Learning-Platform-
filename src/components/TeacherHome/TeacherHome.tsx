import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import { collection, onSnapshot, Timestamp, query, orderBy, limit, where } from 'firebase/firestore';

import { db } from '../../firebase';

import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
import ChartDataLabels from 'chartjs-plugin-datalabels';



interface Course {
  id: string;
  title: string;
  subTitle: string;
  term: string;
  capacity: number;
  startDate: Timestamp;
  endDate: Timestamp;
  gradeLevel?: string;
  status?: string;
  createdAt?: Timestamp;
  teacherId: string;
}


const TeacherHome: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);

  const { user } = useAuth();
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  useEffect(() => {
    if (!user?.uid) return;

    const coursesQuery = query(
      collection(db, "courses"),
      where("teacherId", "==", user.uid)
    );

    const unsub = onSnapshot(coursesQuery, (snapshot) => {
      setCourseCount(snapshot.docs.length);

      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      setCourses(coursesData);
      const courseIds = snapshot.docs.map((doc) => doc.id);

      if (courseIds.length > 0) {
        let enrollmentsQuery;
        if (courseIds.length <= 10) {
          enrollmentsQuery = query(
            collection(db, "enrollments"),
            where("courseId", "in", courseIds)
          );
        } else {
          enrollmentsQuery = collection(db, "enrollments");
        }

        const enrollmentsUnsub = onSnapshot(enrollmentsQuery, (enrollmentsSnapshot) => {
          const total = enrollmentsSnapshot.docs.reduce((sum, doc) => {
            const enrollmentData = doc.data();
            if (courseIds.includes(enrollmentData.courseId)) {
              return sum + (enrollmentData.amount || 0);
            }
            return sum;
          }, 0);
          setTotalPayments(total);

          const enrollmentsCount = enrollmentsSnapshot.docs.filter((doc) => {
            const enrollmentData = doc.data();
            return courseIds.includes(enrollmentData.courseId);
          }).length;
          setStudentCount(enrollmentsCount);
        });

        return () => enrollmentsUnsub();
      } else {
        setTotalPayments(0);
        setStudentCount(0);
      }
    });

    return () => unsub();
  }, [user?.uid]);

  const data = {
    labels: ["المدفوعات", "الكورسات", "الطلاب"],
    datasets: [
      {
        label: "الإحصائيات",
        data: [totalPayments, courseCount, studentCount],
        backgroundColor: isDarkMode
          ? [
            "rgba(139, 92, 246, 0.3)",
            "rgba(34, 197, 94, 0.3)",
            "rgba(251, 146, 60, 0.3)",
          ]
          : ["#fff3e0", "#f1f8e9", "#ffe0b2"],
        borderColor: isDarkMode
          ? [
            "rgba(139, 92, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(251, 146, 60, 0.8)",
          ]
          : ["#f57c00", "#689f38", "#ff9800"],
        borderWidth: 1,
      },
    ],
  };



  const options = {
    responsive: true,
    indexAxis: "x" as const,
    scales: { x: { beginAtZero: true } },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      datalabels: {
        anchor: "end" as const,
        align: "right" as const,
        // formatter: (value: number, context: any) => {
        //   const total = context.chart.data.datasets[0].data.reduce(
        //     (a: number, b: number) => a + b,
        //     0
        //   );
        // const percentage = ((value / total) * 100).toFixed(1) + '%';
        // return percentage;
        // },
        color: theme.palette.text.primary,
        font: { weight: 'bold' as const, size: 14 },
      },
    },
  };





  return (
    <>
      <Stack direction={'row'} sx={{ flexWrap: 'wrap', gap: 2, justifyContent: "space-around" }}>
        <Box sx={{
          backgroundColor: theme.palette.background.paper,
          width: { xs: '100%', md: '40%', lg: '90%' },
          height: 300,
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          mt: 4,
        }}>

          <Bar data={data} options={options} />
        </Box>

      </Stack>
      <Box sx={{ p: 3, width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Table dir="rtl">
            <TableHead>
              <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.8)' }}>
                <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>عنوان الكورس</TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>الترم</TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>تاريخ البدء</TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>تاريخ الانتهاء</TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>المرحلة الدراسية</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} sx={{
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                  }
                }}>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>{course.title}</TableCell>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>{course.term}</TableCell>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>
                    {course.startDate && typeof course.startDate.toDate === 'function'
                      ? course.startDate.toDate().toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>
                    {course.endDate && typeof course.endDate.toDate === 'function'
                      ? course.endDate.toDate().toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: theme.palette.text.primary }}>{course.gradeLevel || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default TeacherHome;