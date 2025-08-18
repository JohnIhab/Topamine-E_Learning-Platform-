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
import Chart from '../Chart/Chart'


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

  const { user } = useAuth();
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const coursesQuery = query(
      collection(db, 'courses'),
      where('teacherId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsub = onSnapshot(coursesQuery, (snapshot) => {
      const courseList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[]
      
      setCourses(courseList);
    });

    return () => unsub();
  }, [user?.uid]);
  console.log(courses)

 

  return (
    <>
      <Chart/>
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