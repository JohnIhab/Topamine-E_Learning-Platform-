import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentsIcon from '@mui/icons-material/Payments';
import { doc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import EditPopover from '../EditPage/EditPopover';

interface CourseCardProps {
  id: string;
  title: string;
  subTitle: string;
  image?: string;
  capacity: number;
  term: string;
  startDate: Timestamp;
  endDate: Timestamp;
  gradeLevel: string;
  teacherName?: string; // Make optional since we'll get it from context
  teacherId?: string; // Add teacherId to fetch teacher info
  price: number;
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
  gradeLevel,
  teacherName: propTeacherName,
  teacherId,
  price,
}) => {
  const navigate = useNavigate();
  const { user, role }: any = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [teacherName, setTeacherName] = useState<string>(propTeacherName || '');

  // Fetch teacher name from context or Firebase
  useEffect(() => {
    const fetchTeacherName = async () => {
      // If teacherName is already provided as prop, use it
      if (propTeacherName) {
        setTeacherName(propTeacherName);
        return;
      }

      // If current user is a teacher, use their name
      if (user && role === 'teacher') {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTeacherName(userData.name || user.displayName || 'المعلم');
          }
        } catch (error) {
          console.error('Error fetching teacher name:', error);
          setTeacherName('المعلم');
        }
      } 
      // If teacherId is provided, fetch teacher info
      else if (teacherId) {
        try {
          const teacherDoc = await getDoc(doc(db, 'users', teacherId));
          if (teacherDoc.exists()) {
            const teacherData = teacherDoc.data();
            setTeacherName(teacherData.name || 'المعلم');
          }
        } catch (error) {
          console.error('Error fetching teacher info:', error);
          setTeacherName('المعلم');
        }
      }
      // Default fallback
      else {
        setTeacherName('المعلم');
      }
    };

    fetchTeacherName();
  }, [user, role, propTeacherName, teacherId]);

  const handleEditIconClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setEditAnchorEl(event.currentTarget as any);
    setEditOpen(true);
  };

  const handleDeleteIconClick = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
      handleDelete();
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditAnchorEl(null);
  };

  const handleCourseUpdated = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    setImageLoading(false);
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Ob3QgRm91bmQ8L3RleHQ+PC9zdmc+';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
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
      <EditPopover
        open={editOpen}
        anchorEl={editAnchorEl}
        onClose={handleEditClose}
        courseId={id}
        onCourseUpdated={handleCourseUpdated}
      />

      <Box
        sx={{
          position: 'fixed',
          top: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: 'Tajawal',
        }}
      >
        {success && <Alert severity="success" sx={{ width: '20%', ml: 150 }}>تم حذف الكورس بنجاح!</Alert>}
        {error && <Alert severity="error" sx={{ width: '50%' }}>فشل في حذف الكورس</Alert>}
      </Box>

      <Card
        sx={{
          width: 300,
          height: 'auto',
          borderRadius: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ position: 'relative', height: 140 }}>
          {imageLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                gap: 1,
              }}
            >
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                جارى التحميل
              </Typography>
            </Box>
          )}
          <CardMedia
            component="img"
            height="140"
            image={image || ''}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease',
              backgroundColor: '#f8f8f8',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Tooltip title={teacherName}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: '500',
                  fontSize: '0.85rem',
                  color: '#374151',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                ا/ {teacherName}
              </Typography>
            </Tooltip>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, mt: 1 }}>
              <Tooltip title={title}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    maxWidth: '160px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {title}
                </Typography>
              </Tooltip>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <EditIcon sx={{ color: '#2563EB', cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleEditIconClick} />
                <DeleteIcon sx={{ color: '#DC2626', cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleDeleteIconClick} />
              </Box>
            </Stack>

            <Typography
              variant="subtitle2"
              sx={{
                color: '#4B5563',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                fontSize: '0.85rem',
                height: '40px',
              }}
            >
              {subTitle}
            </Typography>

            <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
              <Box sx={{ mt: 1 }}>
                <Typography color="#4B5563" sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
                  <ImportContactsIcon sx={{ color: 'gray', fontSize: 16 }} /> {gradeLevel}
                </Typography>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography color="#4B5563" sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
                  <CalendarTodayIcon sx={{ color: 'gray', fontSize: 16 }} /> {term}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1}>
                <CalendarTodayIcon sx={{ color: 'gray', fontSize: 16 }} />
                <Typography sx={{ color: '#4B5563', fontSize: '14px' }}>
                  {startDate?.toDate().toDateString() ?? 'No Start Date'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <CalendarTodayIcon sx={{ color: 'gray', fontSize: 16 }} />
                <Typography sx={{ color: '#4B5563', fontSize: '14px' }}>
                  {endDate?.toDate().toDateString() ?? 'No End Date'}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography color="black" sx={{ fontSize: '18px', fontWeight: 700 }}>
              <PaymentsIcon sx={{ fontSize: 20, verticalAlign: 'middle' }} /> {price} ج
            </Typography>
            <Button variant="outlined" size="small" onClick={() => navigate(`/coursedetalis/${id}`)}>
              عرض التفاصيل
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCard;
