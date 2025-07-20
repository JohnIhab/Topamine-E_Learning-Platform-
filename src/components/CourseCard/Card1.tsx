import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import { doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import PaymentsIcon from '@mui/icons-material/Payments';
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
  teacherName:string;
  price:number;
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
  teacherName,
  price
}) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);


  useEffect(() => {
    console.log('CourseCard image URL:', image);
    setImageLoading(true);
    setImageError(false);
  }, [image]);

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setEditAnchorEl(event.currentTarget);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditAnchorEl(null);
  };

  const handleCourseUpdated = () => {
  
    window.location.reload();
  };

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        setSuccess(true);
      } catch (err) {
        setError(true);
      }
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', image);
    setImageError(true);
    setImageLoading(false);
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/350x180?text=No+Image';
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
          fontFamily:'Tajawal'
        }}
      >
        {success && <Alert severity="success" sx={{ width: '20%',ml:150 }}>تم حذف الكورس بنجاح!</Alert>}
        {error && <Alert severity="error" sx={{ width: '50%' }}>فشل في حذف الكورس</Alert>}
      </Box>

      <Card
        sx={{
          width: 300,
          height: 410,
          borderRadius: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ position: 'relative', height: '140px' }}>
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
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                جاري تحميل الصورة
              </Typography>
            </Box>
          )}
          <CardMedia
            component="img"
            height="140"
            image={image || 'https://via.placeholder.com/350x140?text=No+Image'}
            alt={title}
            sx={{ 
              objectFit: 'contain',
              width: '100%',
              height: '150px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease',
              backgroundColor: '#f8f8f8'
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box>
           <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  fontSize: '0.9rem'
                }}
              >
              ا/ {teacherName}
              </Typography>
            <Stack direction={'row'} justifyContent="space-between" alignItems="center" sx={{ mb: 1 ,mt:1}}>
              {/* <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  fontSize: '0.9rem'
                }}
              >
              ا/ {teacherName}
              </Typography> */}

              <Typography
                // variant="h6"
                sx={{
                  fontWeight: '700',
                 
                  maxWidth: '120px',
                  fontSize: '18px',
                  lineHeight:'28px',
                  
                  
                }}
              >
                {title}
              </Typography>

              <Box sx={{display:'flex',gap:2}}>
                <img src='/edit.png'  onClick={handleEdit} style={{ cursor: 'pointer' }} />
                <img src='/delete.png' onClick={handleDelete} style={{ cursor: 'pointer' }}/>
                {/* <EditIcon sx={{ color: 'blue', cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleEdit} /> */}
                {/* <DeleteIcon sx={{ color: 'red', cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleDelete} /> */}
              </Box>
            </Stack>
           {/* <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  fontSize: '0.9rem'
                }}
              >
                {title}
              </Typography> */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#4B5563', 
                mb: 2,
                
                
                height: '16px',
                fontWeight:'400',
                 lineHeight:'24px'
              }}
            >
              {subTitle}
            </Typography>

            <Stack direction={'row'} spacing={3} sx={{ mb: 1  }}>
              <Box sx={{mt:1}}>
                <Typography  color="#4B5563" sx={{ fontSize: '14px',fontWeight:400,lineHeight:'20px' }}>
                <ImportContactsIcon sx={{ color: 'gray', width: "16x",height:'16px'}} />
                {gradeLevel}
              </Typography>
              </Box>
               

              {/* <Typography color="#4B5563" sx={{ fontSize: '14px',fontWeight:400,lineHeight:'20px' }}>
                <PeopleAltIcon sx={{ color: 'gray', width: 12, pt: 0.5 }} />
                {capacity} Students
              </Typography> */}
<Box sx={{mt:1}}>
  
              <Typography color="#4B5563" sx={{ fontSize: '14px',fontWeight:400,lineHeight:'20px' }}>
                <CalendarTodayIcon sx={{ color: 'gray',  width: "16x",height:'16px'}} />
                {term}
              </Typography>
</Box>
            </Stack>

            <Stack direction={'column'} spacing={.5} sx={{  mt:1 }}>
              <Stack direction={'row'}>
                <CalendarTodayIcon sx={{ color: 'gray',  width: "16x",height:'16px'}} />
                <Typography sx={{ color: '#4B5563',fontSize: '14px',fontWeight:400,lineHeight:'20px' }}>
                  {startDate && typeof startDate.toDate === 'function'
                    ? startDate.toDate().toDateString()
                    : 'No Start Date'}
                </Typography>
              </Stack>

              <Stack direction={'row'}>
                <CalendarTodayIcon sx={{ color: 'gray',  width: "16x",height:'16px'}} />
                <Typography sx={{ color: '#4B5563',fontSize: '14px',fontWeight:400,lineHeight:'20px' }}>
                  {endDate && typeof endDate.toDate === 'function'
                    ? endDate.toDate().toDateString()
                    : 'No end Date'}
                </Typography>
              </Stack>
               
            
              
            </Stack>
          </Box>
              
            
    <Stack direction={'row'} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
       <Box  >
          <Typography  color="black" sx={{ fontSize: '20px',fontWeight:700}}>
                
                <PaymentsIcon sx={{ color: 'black', width: "20x",height:'24px',pt:1}} />
                {price}ج
              </Typography>
        </Box>
          <Box >
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/coursedetalis/${id}`)}
              sx={{ mt: 'auto' }}
            >
             عرض التفاصيل
            </Button>
          </Box>
    </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default CourseCard; 