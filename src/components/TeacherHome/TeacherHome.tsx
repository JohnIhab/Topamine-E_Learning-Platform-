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
} from '@mui/material';
import Header from '../Header/Header.tsx';
import ResponsiveDrawer from "../Aside/ResponsiveDrawer.tsx";
// import Charts from '../Chart.tsx';
import { collection, onSnapshot, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DashboardHighlight from '../DashboardHighlight/DashboardHighlight.tsx';
import { Outlet } from 'react-router-dom';
// import { position } from 'stylis';

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
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const TeacherHome: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {

    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsub = onSnapshot(coursesQuery, (snapshot) => {
      const courseList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(courseList);
    });

    return () => unsub();
  }, []);

   const data = {
    labels: ['الكورسات', 'المدفوعات', 'الطلاب'],
    datasets: [
      {
        label: 'الإحصائيات',
        data: [12, 59.700, 248],
        backgroundColor: ['#fff3e0', '#f1f8e9', '#ffe0b2'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        color: '#000',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
      },
    },
  };

  return (
    <>
      {/* Dashboard content for /teacherdashboard */}
      <Stack direction={'row'} sx={{ flexWrap: 'wrap', gap: 2,justifyContent:"space-around" }}>
        <Box sx={{ backgroundColor: 'white', width: { xs: '100%', md: '40%' }, height: 300, p: 2, borderRadius: 2, boxShadow: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 4, }}>
          <Doughnut data={data} options={options} />
        </Box>
        <Box sx={{ mt: { xs: 2, md: 10 }, width: { xs: '100%', md: 'auto' } }}>
          <DashboardHighlight />
        </Box>
      </Stack>
      <Box sx={{ p: 3, width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell align="right">عنوان الكورس</TableCell>
                <TableCell align="right">الوصف</TableCell>
                <TableCell align="right">الترم</TableCell>
                <TableCell align="right">السعة</TableCell>
                <TableCell align="right">تاريخ البدء</TableCell>
                <TableCell align="right">تاريخ الانتهاء</TableCell>
                <TableCell align="right">المرحلة الدراسية</TableCell>
                <TableCell align="right">الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell align="right">{course.title}</TableCell>
                  <TableCell align="right">{course.subTitle}</TableCell>
                  <TableCell align="right">{course.term}</TableCell>
                  <TableCell align="right">{course.capacity}</TableCell>
                  <TableCell align="right">
                    {course.startDate && typeof course.startDate.toDate === 'function'
                      ? course.startDate.toDate().toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {course.endDate && typeof course.endDate.toDate === 'function'
                      ? course.endDate.toDate().toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right">{course.gradeLevel || '—'}</TableCell>
                  <TableCell align="right">{course.status || '—'}</TableCell>
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