
import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Avatar, InputLabel, MenuItem,
  FormControl, Select, LinearProgress, Stack
} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import { SelectChangeEvent } from '@mui/material/Select';
import Header from '../Header/Header';
import ResponsiveDrawer from '../Aside/ResponsiveDrawer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';


const StaticProgress: React.FC<{ value?: number }> = ({ value = 50 }) => {
  let barColor: 'success' | 'warning' | 'error' = 'error';
  let label = 'ضعيف';

  if (value >= 80) {
    barColor = 'success';
    label = 'ممتاز';
  } else if (value >= 60) {
    barColor = 'warning';
    label = 'جيد';
  }

  return (
    <Stack spacing={1} sx={{ minWidth: 100 }}>
      <LinearProgress
        variant="determinate"
        value={value}
        color={barColor}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {value}% - {label}
      </Typography>
    </Stack>
  );
};

interface StudentRow {
  الاسم: string;
  البريد: string;
  'تاريخ التسجيل': string;
  التقدم: number;
  الدرجة: string;
  'آخر دخول': string;
}

const Students: React.FC = () => {
  const theme = createTheme({ direction: 'rtl' });
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const rows1: StudentRow[] = [
    {
      الاسم: 'أحمد محمد',
      البريد: 'ahmed@gmail.com',
      'تاريخ التسجيل': '١ سبتمبر ٢٠٢٣',
      التقدم: 85,
      الدرجة: 'A',
      'آخر دخول': 'منذ ساعتين',
    },
    {
      الاسم: 'ليلى علي',
      البريد: 'ahmed@gmail.com',
      'تاريخ التسجيل': '١٥ أغسطس ٢٠٢٣',
      التقدم: 60,
      الدرجة: 'B',
      'آخر دخول': 'منذ يوم',
    },
    {
      الاسم: 'سارة حسن',
      البريد: 'ahmed@gmail.com',
      'تاريخ التسجيل': '١٠ يوليو ٢٠٢٣',
      التقدم: 92,
      الدرجة: 'A',
      'آخر دخول': 'منذ ٣ ساعات',
    },
    {
      الاسم: 'أحمد يوسف',
      البريد: 'ahmed@gmail.com',
      'تاريخ التسجيل': '١ سبتمبر ٢٠٢٣',
      التقدم: 50,
      الدرجة: 'C',
      'آخر دخول': 'منذ ٥ دقائق',
    },
    {
      الاسم: 'نورا خالد',
      البريد: 'ahmed@gmail.com',
      'تاريخ التسجيل': '٢٠ يونيو ٢٠٢٣',
      التقدم: 75,
      الدرجة: 'B',
      'آخر دخول': 'منذ ٤ أيام',
    },
  ];

  const [filterBy, setFilterBy] = useState<string>('');
  const [filterData, setFilterData] = useState<StudentRow[]>(rows1);

  const handleFilterChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string;
    setFilterBy(value);
    if (value === '') {
      setFilterData(rows1);
    } else if (value === 'grade') {
      setFilterData(rows1.filter(item => item.الدرجة === 'A'));
    } else if (value === 'name') {
      setFilterData(rows1.filter(item => item.الاسم.includes('أحمد')));
    } else if (value === 'email') {
      setFilterData(rows1.filter(item => item.البريد.includes('@')));
    } else if (value === 'progress') {
      setFilterData(rows1.filter(item => item.التقدم >= 70));
    } else if (value === 'enrollment') {
      setFilterData([...rows1].sort((a, b) =>
        new Date(a['تاريخ التسجيل']).getTime() - new Date(b['تاريخ التسجيل']).getTime()
      ));
    }
  };

  return (
    <Box>
      <Header />
      <ResponsiveDrawer />
      <Box sx={{ mr: '243px', p: 9, backgroundColor: '#f5f5f5', width: '83vw' }}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                width: '100%',
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                الطلاب المسجلين
              </Typography>
              <Box sx={{ minWidth: 160 }}>
                <FormControl fullWidth dir="rtl">
                  <InputLabel id="select-label">ترتيب حسب</InputLabel>
                  <Select
                    labelId="select-label"
                    value={filterBy}
                    label="ترتيب حسب"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="name">الاسم</MenuItem>
                    <MenuItem value="email">البريد الإلكتروني</MenuItem>
                    <MenuItem value="grade">الدرجة</MenuItem>
                    <MenuItem value="progress">التقدُّم</MenuItem>
                    <MenuItem value="enrollment">تاريخ التسجيل</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 600, overflow: 'auto', borderRadius: 3 }}>
              <Table dir="rtl" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">البريد الإلكتروني</TableCell>
                    <TableCell align="center">اسم الطالب</TableCell>
                    <TableCell align="center">تاريخ التسجيل</TableCell>
                    <TableCell align="center">التقدُّم</TableCell>
                    <TableCell align="center">الدرجة</TableCell>
                    <TableCell align="center">آخر دخول</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mr: 7 }}>
                          <Avatar src={'https://via.placeholder.com/40?text=S'} sx={{ width: 32, height: 32 }} />
                          <Typography>{row['البريد']}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{row['الاسم']}</TableCell>
                      <TableCell align="center">{row['تاريخ التسجيل']}</TableCell>
                      <TableCell align="center">
                        <StaticProgress value={row['التقدم']} />
                      </TableCell>
                      <TableCell align="center">{row['الدرجة']}</TableCell>
                      <TableCell align="center">{row['آخر دخول']}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>
        </CacheProvider>
      </Box>
    </Box>
  );
};

export default Students;
