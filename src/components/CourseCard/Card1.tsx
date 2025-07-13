import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.ts';

interface CourseCardProps {
  id: string;
  title: string;
  subTitle: string;
  image?: string;
  capacity: number;
  term: string;
  startDate: Timestamp;
  endDate: Timestamp;
  grade: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  subTitle,
  image,
  capacity,
  term,
  startDate,
  endDate,
  grade,
}) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleEdit = () => {
    navigate(`/courseMangement/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        setSuccess(true);
      } catch (err) {
        setError(true);
      }
    }
  };

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <>
 
      <Box
        sx={{
          position: 'fixed',
          top: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily:'Tajawal'
        }}
      >
        {success && <Alert severity="success" sx={{ width: '20%',ml:150 }}>تم حذف الكورس بنجاح!</Alert>}
        {error && <Alert severity="error" sx={{ width: '50%' }}>فشل في حذف الكورس</Alert>}
      </Box>

      <Card
        sx={{
          width: 345,
          height: 420,
          margin: 2,
          borderRadius: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={image || 'https://via.placeholder.com/300x160?text=No+Image'}
          alt={title}
        />
        <CardContent>
          <Stack direction={'row'} justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
              }}
            >
              {title}
            </Typography>

            <Box>
              <EditIcon sx={{ color: 'blue', cursor: 'pointer' }} onClick={handleEdit} />
              <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={handleDelete} />
            </Box>
          </Stack>

          <Typography variant="subtitle1" sx={{ color: 'gray' }}>
            {subTitle}
          </Typography>

          <Stack direction={'row'} spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <ImportContactsIcon sx={{ color: 'gray', width: 15, pt: 1.5 }} />
              {grade}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <PeopleAltIcon sx={{ color: 'gray', width: 15, pt: 1.5 }} />
              {capacity} Students
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <CalendarTodayIcon sx={{ color: 'gray', width: 15, pt: 1.5 }} />
              {term}
            </Typography>
          </Stack>

          <Stack direction={'row'} spacing={2} sx={{ mt: 1 }}>
            <Stack direction={'row'}>
              <CalendarTodayIcon sx={{ color: 'gray', width: 15, pt: 1 }} />
              <Typography sx={{ color: 'gray', fontSize: 13, mt: 1 }}>
                {startDate && typeof startDate.toDate === 'function'
                  ? startDate.toDate().toDateString()
                  : 'No Start Date'}
              </Typography>
            </Stack>

            <Stack direction={'row'}>
              <CalendarTodayIcon sx={{ color: 'gray', width: 15, pt: 1 }} />
              <Typography sx={{ color: 'gray', fontSize: 13, mt: 1 }}>
                {endDate && typeof endDate.toDate === 'function'
                  ? endDate.toDate().toDateString()
                  : 'No end Date'}
              </Typography>
            </Stack>
          </Stack>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/coursedetalis/${id}`)}
              sx={{ mt: 1 }}
            >
             عرض التفاصيل
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default CourseCard; 