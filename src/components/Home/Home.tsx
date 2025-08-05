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
} from '@mui/material';
import Header from '../Header/Header';
import ResponsiveDrawer from "../Aside/ResponsiveDrawer";
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
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
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'courses'), (snapshot) => {
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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
      <Header />
      {/* <Charts /> */}
        <Box sx={{ backgroundColor: 'white', width: "40vw", height: 300, p: 2, borderRadius: 2, boxShadow: 2,display: 'flex', justifyContent: 'center', flexWrap: 'wrap',mr:108,mt:4 }}>
        <Doughnut data={data} options={options} />
      </Box>
       <Box sx={{ p: 3 ,width:'80vw',mr:35}}>
        <TableContainer component={Paper}>
          <Table dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell align="right" >عنوان الكورس</TableCell>
                <TableCell align="right" >الوصف</TableCell>
                <TableCell align="right" >الترم</TableCell>
                <TableCell align="right" >السعة</TableCell>
                <TableCell align="right" >تاريخ البدء</TableCell>
                <TableCell align="right" >تاريخ الانتهاء</TableCell>
                <TableCell align="right" >المرحلة الدراسية</TableCell>
                <TableCell align="right" >الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell align="right" >{course.title}</TableCell>
                  <TableCell align="right" >{course.subTitle}</TableCell>
                  <TableCell align="right" >{course.term}</TableCell>
                  <TableCell align="right" >{course.capacity}</TableCell>
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
      <ResponsiveDrawer />
    </Box>
  );
}

export default Home; 