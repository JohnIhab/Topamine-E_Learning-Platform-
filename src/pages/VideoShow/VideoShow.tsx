// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Box,
//   Grid,
//   List,
//   ListItem,
//   ListItemButton,
//   Typography,
//   Card,
//   CardContent,
//   Avatar,
//   Chip,
//   LinearProgress,
//   IconButton,
//   Button,
//   Divider,
// } from "@mui/material";
// import { doc, getDoc } from 'firebase/firestore';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import DownloadIcon from '@mui/icons-material/Download';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import DescriptionIcon from '@mui/icons-material/Description';
// // @ts-ignore
// import { db } from '../../firebase';
// import { useAuth } from '../../context/AuthContext';
// import NotFound from '../NotFound/NotFound';

// type Video = {
//   title: string;
//   url: string;
//   duration?: string;
//   completed?: boolean;
//   docUrl?: string;
//   txtUrl?: string;
// };

// const videoList: Video[] = [
//   {
//     title: "مقدمة في البرمجة",
//     url: "",
//     duration: "15:30",
//     completed: false,
//   },
//   {
//     title: "المتغيرات والثوابت",
//     url: "",
//     duration: "22:15",
//     completed: false,
//   },
//   {
//     title: "الحلقات التكرارية",
//     url: "",
//     duration: "18:45",
//     completed: false,
//   },
// ];

// const VideoShow: React.FC = () => {
//   const [selectedVideo, setSelectedVideo] = useState<Video>(videoList[0]);
//   const [courseData, setCourseData] = useState<any>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentProgress, setCurrentProgress] = useState(0);
//   const [hasAccess, setHasAccess] = useState<boolean | null>(null);
//   const location = useLocation();
//   const { user }: any = useAuth();

//   // Get courseId from navigation state
//   const courseId = location.state?.courseId;

//   console.log("🎥 VideoShow component loaded");
//   console.log("📍 Location state:", location.state);
//   console.log("🆔 Course ID from navigation:", courseId);

//   // Check if user has access to this course
//   useEffect(() => {
//     const checkAccess = async () => {
//       console.log("🔍 Checking access...");
//       console.log("📋 CourseId:", courseId);
//       console.log("👤 User:", user);
      
//       if (!courseId) {
//         console.log("❌ No courseId provided");
//         setHasAccess(false);
//         return;
//       }

//       if (!user) {
//         console.log("❌ No user authenticated");
//         setHasAccess(false);
//         return;
//       }

//       // TEMPORARY: Allow all authenticated users to access videos
//       console.log("✅ Temporarily allowing all authenticated users");
//       setHasAccess(true);
//       return;

//       /*
//       try {
//         // Check if user has purchased this course
//         const userDoc = await getDoc(doc(db, 'users', user.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const purchasedCourses = userData.purchasedCourses || [];
          
//           console.log("📚 User's purchased courses:", purchasedCourses);
          
//           // Check if the courseId is in the user's purchased courses
//           const hasPurchased = purchasedCourses.some((course: any) => 
//             course.courseId === courseId || course.id === courseId
//           );
          
//           console.log("✅ Has purchased course:", hasPurchased);
          
//           // Allow access if user has purchased the course OR if it's a teacher/admin
//           // For testing purposes, also allow if user role is teacher or admin
//           const userRole = userData.role;
//           console.log("👤 User role:", userRole);
          
//           const hasValidAccess = hasPurchased || userRole === 'teacher' || userRole === 'admin';
//           console.log("🔑 Final access decision:", hasValidAccess);
          
//           setHasAccess(hasValidAccess);
//         } else {
//           console.log("❌ User document not found");
//           setHasAccess(false);
//         }
//       } catch (error) {
//         console.error('❌ Error checking course access:', error);
//         setHasAccess(false);
//       }
//       */
//     };

//     checkAccess();
//   }, [courseId, user]);

//   // Helper function to handle file downloads
//   const handleDownload = (url: string, filename: string) => {
//     if (url) {
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       link.target = '_blank';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       if (courseId) {
//         try {
//           const courseDoc = await getDoc(doc(db, 'courses', courseId));
//           if (courseDoc.exists()) {
//             const course = courseDoc.data();
//             setCourseData(course);

//             // If course has lectures, use them instead of hardcoded videos
//             if (course.lectures && course.lectures.length > 0) {
//               const courseVideos = course.lectures.map((lecture: any, index: number) => ({
//                 title: lecture.title || `الدرس ${index + 1}`,
//                 url: lecture.videoUrl || '',
//                 duration: lecture.duration || "00:00",
//                 completed: false,
//                 docUrl: lecture.docUrl || '',
//                 txtUrl: lecture.txtUrl || ''
//               })).filter((video: Video) => video.url);

//               if (courseVideos.length > 0) {
//                 setSelectedVideo(courseVideos[0]);
//               }
//             }
//           }
//         } catch (error) {
//           console.error('Error fetching course data:', error);
//         }
//       }
//     };

//     fetchCourseData();
//   }, [courseId]);

//   // Use course lectures if available, otherwise fall back to hardcoded videos
//   const videosToShow = courseData?.lectures
//     ? courseData.lectures.map((lecture: any, index: number) => ({
//       title: lecture.title || `الدرس ${index + 1}`,
//       url: lecture.videoUrl || '',
//       duration: lecture.duration || "00:00",
//       completed: false,
//       docUrl: lecture.docUrl || '',
//       txtUrl: lecture.txtUrl || ''
//     })).filter((video: Video) => video.url)
//     : videoList;

//   // Show loading while checking access
//   if (hasAccess === null) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: "#f5f7fa",
//         }}
//       >
//         <Typography variant="h6">جاري التحقق من الوصول...</Typography>
//       </Box>
//     );
//   }

//   // If no access, show NotFound page
//   if (!hasAccess) {
//     return <NotFound />;
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//         py: 3,
//       }}
//     >
//       {/* Header Section */}
//       <Box sx={{ mb: 4, px: 3 }}>
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "#2c3e50",
//             mb: 1
//           }}
//         >
//           {courseData?.title || "مشغل الفيديو"}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           sx={{
//             textAlign: "center",
//             color: "#7f8c8d",
//             mb: 2
//           }}
//         >
//           {videosToShow.length} درس متاح
//         </Typography>
//         <LinearProgress
//           variant="determinate"
//           value={currentProgress}
//           sx={{
//             height: 8,
//             borderRadius: 4,
//             bgcolor: "rgba(0,0,0,0.1)",
//             "& .MuiLinearProgress-bar": {
//               borderRadius: 4,
//               bgcolor: "#3498db"
//             }
//           }}
//         />
//       </Box>

//       <Grid container spacing={3} sx={{ px: 3 }}>
//         {/* Video Playlist */}
//         <Grid size={{ xs: 12, lg: 4 }}>
//           <Card
//             elevation={8}
//             sx={{
//               borderRadius: 3,
//               overflow: "hidden",
//               background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
//               border: "1px solid rgba(0,0,0,0.05)"
//             }}
//           >
//             <CardContent sx={{ p: 0 }}>
//               <Box sx={{
//                 p: 3,
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 color: "white"
//               }}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                   <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
//                     <VideoLibraryIcon />
//                   </Avatar>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                     قائمة الدروس
//                   </Typography>
//                 </Box>
//               </Box>

//               <List sx={{ p: 0 }}>
//                 {videosToShow.map((video: any, index: number) => (
//                   <ListItem key={index} disablePadding>
//                     <ListItemButton
//                       selected={video.url === selectedVideo.url}
//                       onClick={() => setSelectedVideo(video)}
//                       sx={{
//                         py: 2,
//                         px: 3,
//                         borderBottom: "1px solid rgba(0,0,0,0.05)",
//                         "&.Mui-selected": {
//                           bgcolor: "rgba(102, 126, 234, 0.1)",
//                           borderRight: "4px solid #667eea",
//                         },
//                         "&:hover": {
//                           bgcolor: "rgba(102, 126, 234, 0.05)",
//                         }
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
//                         <Avatar
//                           sx={{
//                             width: 40,
//                             height: 40,
//                             bgcolor: video.completed ? "#27ae60" : "#bdc3c7",
//                             fontSize: "0.9rem"
//                           }}
//                         >
//                           {video.completed ? (
//                             <CheckCircleIcon sx={{ color: "white" }} />
//                           ) : (
//                             <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                               {index + 1}
//                             </Typography>
//                           )}
//                         </Avatar>

//                         <Box sx={{ flex: 1 }}>
//                           <Typography
//                             variant="body1"
//                             sx={{
//                               fontWeight: video.url === selectedVideo.url ? "bold" : "normal",
//                               color: "#2c3e50",
//                               mb: 0.5
//                             }}
//                           >
//                             {video.title}
//                           </Typography>

//                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <AccessTimeIcon sx={{ fontSize: 16, color: "#7f8c8d" }} />
//                             <Typography variant="caption" color="#7f8c8d">
//                               {video.duration || "00:00"}
//                             </Typography>
//                             {video.completed && (
//                               <Chip
//                                 label="مكتمل"
//                                 size="small"
//                                 sx={{
//                                   bgcolor: "#27ae60",
//                                   color: "white",
//                                   fontSize: "0.7rem",
//                                   height: 20
//                                 }}
//                               />
//                             )}
//                             {(video.docUrl || video.txtUrl) && (
//                               <Chip
//                                 icon={<DownloadIcon sx={{ fontSize: "12px !important" }} />}
//                                 label="ملفات"
//                                 size="small"
//                                 sx={{
//                                   bgcolor: "#3498db",
//                                   color: "white",
//                                   fontSize: "0.7rem",
//                                   height: 20
//                                 }}
//                               />
//                             )}
//                           </Box>
//                         </Box>

//                         <IconButton
//                           size="small"
//                           sx={{
//                             color: video.url === selectedVideo.url ? "#667eea" : "#bdc3c7"
//                           }}
//                         >
//                           {isPlaying && video.url === selectedVideo.url ? (
//                             <PauseIcon />
//                           ) : (
//                             <PlayArrowIcon />
//                           )}
//                         </IconButton>
//                       </Box>
//                     </ListItemButton>
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Video Player */}
//         <Grid size={{ xs: 12, lg: 8 }}>
//           <Card
//             elevation={8}
//             sx={{
//               borderRadius: 3,
//               overflow: "hidden",
//               background: "#1a1a1a"
//             }}
//           >
//             <CardContent sx={{ p: 0 }}>
//               {/* Video Title Bar */}
//               <Box sx={{
//                 p: 3,
//                 background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
//                 color: "white"
//               }}>
//                 <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//                   {selectedVideo.title}
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                   <Chip
//                     icon={<AccessTimeIcon />}
//                     label={selectedVideo.duration || "00:00"}
//                     size="small"
//                     sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
//                   />
//                   {selectedVideo.completed && (
//                     <Chip
//                       icon={<CheckCircleIcon />}
//                       label="مكتمل"
//                       size="small"
//                       sx={{ bgcolor: "#27ae60", color: "white" }}
//                     />
//                   )}
//                 </Box>
//               </Box>

//               {/* Video Container */}
//               <Box
//                 sx={{
//                   position: "relative",
//                   paddingTop: "56.25%", // 16:9 aspect ratio
//                   bgcolor: "#000",
//                 }}
//               >
//                 {selectedVideo.url ? (
//                   // <iframe
//                   //   src={selectedVideo.url}
//                   //   title={selectedVideo.title}

//                   //   controlsList="nodownload"
//                   //   style={{
//                   //     position: "absolute",
//                   //     top: 0,
//                   //     left: 0,
//                   //     width: "100%",
//                   //     height: "100%",
//                   //     border: "none",
//                   //   }}
//                   //   allowFullScreen
//                   // />
//                   <video
//                     id="safeVideo"
//                     src={selectedVideo.url}
//                     autoPlay
//                     playsInline
//                     controls={true}
//                     disablePictureInPicture
//                     controlsList="nodownload "
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       width: "100%",
//                       height: "100%",
//                       // pointerEvents: "none", // Prevents pause/seek
//                     }}
//                     onEnded={() => {
//                       const video = document.getElementById("safeVideo") as HTMLVideoElement;
//                       video.controls = true;
//                       video.style.pointerEvents = "auto";
//                     }}
//                   />

//                 ) : (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       width: "100%",
//                       height: "100%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       bgcolor: "#2c3e50",
//                       color: "white"
//                     }}
//                   >
//                     <VideoLibraryIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
//                     <Typography variant="h6" sx={{ opacity: 0.7 }}>
//                       لا يوجد فيديو متاح
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>

//               {/* Download Section */}
//               {(selectedVideo.docUrl || selectedVideo.txtUrl) && (
//                 <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
//                   <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     textAlign="center"
//                     sx={{ color: "white", mb: 3 }}
//                   >
//                     الملفات المرفقة
//                   </Typography>
//                   <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     gap: 2,
//                     flexWrap: 'wrap'
//                   }}>
//                     {selectedVideo.docUrl && (
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<PictureAsPdfIcon />}
//                         onClick={() => handleDownload(selectedVideo.docUrl!, `${selectedVideo.title}-document.pdf`)}
//                         sx={{
//                           textTransform: 'none',
//                           borderRadius: 2,
//                           px: 3,
//                           py: 1.5,
//                           background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
//                           "&:hover": {
//                             background: "linear-gradient(135deg, #c0392b 0%, #a93226 100%)",
//                           }
//                         }}
//                       >
//                         تحميل المستند
//                       </Button>
//                     )}
//                     {selectedVideo.txtUrl && (
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         startIcon={<DescriptionIcon />}
//                         onClick={() => handleDownload(selectedVideo.txtUrl!, `${selectedVideo.title}-notes.txt`)}
//                         sx={{
//                           textTransform: 'none',
//                           borderRadius: 2,
//                           px: 3,
//                           py: 1.5,
//                           background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
//                           "&:hover": {
//                             background: "linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)",
//                           }
//                         }}
//                       >
//                         تحميل الملاحظات
//                       </Button>
//                     )}
//                   </Box>
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default VideoShow;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { doc, getDoc } from 'firebase/firestore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
// @ts-ignore
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import NotFound from '../NotFound/NotFound';

type Video = {
  title: string;
  url: string;
  duration?: string;
  completed?: boolean;
  docUrl?: string;
  txtUrl?: string;
};

const videoList: Video[] = [
  {
    title: "مقدمة في البرمجة",
    url: "",
    duration: "15:30",
    completed: false,
  },
  {
    title: "المتغيرات والثوابت",
    url: "",
    duration: "22:15",
    completed: false,
  },
  {
    title: "الحلقات التكرارية",
    url: "",
    duration: "18:45",
    completed: false,
  },
];

const VideoShow: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videoList[0]);
  const [courseData, setCourseData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const location = useLocation();
  const { user }: any = useAuth();

  // Get courseId from navigation state
  const courseId = location.state?.courseId;

  console.log("🎥 VideoShow component loaded");
  console.log("📍 Location state:", location.state);
  console.log("🆔 Course ID from navigation:", courseId);

  // Check if user has access to this course
  useEffect(() => {
    const checkAccess = async () => {
      console.log("🔍 Checking access...");
      console.log("📋 CourseId:", courseId);
      console.log("👤 User:", user);
      
      if (!courseId) {
        console.log("❌ No courseId provided");
        setHasAccess(false);
        return;
      }

      if (!user) {
        console.log("❌ No user authenticated");
        setHasAccess(false);
        return;
      }

      // TEMPORARY: Allow all authenticated users to access videos
      console.log("✅ Temporarily allowing all authenticated users");
      setHasAccess(true);
      return;

      /*
      try {
        // Check if user has purchased this course
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const purchasedCourses = userData.purchasedCourses || [];
          
          console.log("📚 User's purchased courses:", purchasedCourses);
          
          // Check if the courseId is in the user's purchased courses
          const hasPurchased = purchasedCourses.some((course: any) => 
            course.courseId === courseId || course.id === courseId
          );
          
          console.log("✅ Has purchased course:", hasPurchased);
          
          // Allow access if user has purchased the course OR if it's a teacher/admin
          // For testing purposes, also allow if user role is teacher or admin
          const userRole = userData.role;
          console.log("👤 User role:", userRole);
          
          const hasValidAccess = hasPurchased || userRole === 'teacher' || userRole === 'admin';
          console.log("🔑 Final access decision:", hasValidAccess);
          
          setHasAccess(hasValidAccess);
        } else {
          console.log("❌ User document not found");
          setHasAccess(false);
        }
      } catch (error) {
        console.error('❌ Error checking course access:', error);
        setHasAccess(false);
      }
      */
    };

    checkAccess();
  }, [courseId, user]);

  // Helper function to handle file downloads
  const handleDownload = (url: string, filename: string) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseId) {
        try {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          if (courseDoc.exists()) {
            const course = courseDoc.data();
            setCourseData(course);

            // If course has lectures, use them instead of hardcoded videos
            if (course.lectures && course.lectures.length > 0) {
              const courseVideos = course.lectures.map((lecture: any, index: number) => ({
                title: lecture.title || `الدرس ${index + 1}`,
                url: lecture.videoUrl || '',
                duration: lecture.duration || "00:00",
                completed: false,
                docUrl: lecture.docUrl || '',
                txtUrl: lecture.txtUrl || ''
              })).filter((video: Video) => video.url);

              if (courseVideos.length > 0) {
                setSelectedVideo(courseVideos[0]);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Use course lectures if available, otherwise fall back to hardcoded videos
  const videosToShow = courseData?.lectures
    ? courseData.lectures.map((lecture: any, index: number) => ({
      title: lecture.title || `الدرس ${index + 1}`,
      url: lecture.videoUrl || '',
      duration: lecture.duration || "00:00",
      completed: false,
      docUrl: lecture.docUrl || '',
      txtUrl: lecture.txtUrl || ''
    })).filter((video: Video) => video.url)
    : videoList;

  // Show loading while checking access
  if (hasAccess === null) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f7fa",
        }}
      >
        <Typography variant="h6">جاري التحقق من الوصول...</Typography>
      </Box>
    );
  }

  // If no access, show NotFound page
  if (!hasAccess) {
    return <NotFound />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 3,
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4, px: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#2c3e50",
            mb: 1
          }}
        >
          {courseData?.title || "مشغل الفيديو"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: "center",
            color: "#7f8c8d",
            mb: 2
          }}
        >
          {videosToShow.length} درس متاح
        </Typography>
        <LinearProgress
          variant="determinate"
          value={currentProgress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.1)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              bgcolor: "#3498db"
            }
          }}
        />
      </Box>

      <Grid container spacing={3} sx={{ px: 3 }}>
        {/* Video Playlist */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid rgba(0,0,0,0.05)"
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{
                p: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <VideoLibraryIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    قائمة الدروس
                  </Typography>
                </Box>
              </Box>

              <List sx={{ p: 0 }}>
                {videosToShow.map((video: any, index: number) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={video.url === selectedVideo.url}
                      onClick={() => setSelectedVideo(video)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        "&.Mui-selected": {
                          bgcolor: "rgba(102, 126, 234, 0.1)",
                          borderRight: "4px solid #667eea",
                        },
                        "&:hover": {
                          bgcolor: "rgba(102, 126, 234, 0.05)",
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: video.completed ? "#27ae60" : "#bdc3c7",
                            fontSize: "0.9rem"
                          }}
                        >
                          {video.completed ? (
                            <CheckCircleIcon sx={{ color: "white" }} />
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              {index + 1}
                            </Typography>
                          )}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: video.url === selectedVideo.url ? "bold" : "normal",
                              color: "#2c3e50",
                              mb: 0.5
                            }}
                          >
                            {video.title}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: "#7f8c8d" }} />
                            <Typography variant="caption" color="#7f8c8d">
                              {video.duration || "00:00"}
                            </Typography>
                            {video.completed && (
                              <Chip
                                label="مكتمل"
                                size="small"
                                sx={{
                                  bgcolor: "#27ae60",
                                  color: "white",
                                  fontSize: "0.7rem",
                                  height: 20
                                }}
                              />
                            )}
                            {(video.docUrl || video.txtUrl) && (
                              <Chip
                                icon={<DownloadIcon sx={{ fontSize: "12px !important" }} />}
                                label="ملفات"
                                size="small"
                                sx={{
                                  bgcolor: "#3498db",
                                  color: "white",
                                  fontSize: "0.7rem",
                                  height: 20
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        <IconButton
                          size="small"
                          sx={{
                            color: video.url === selectedVideo.url ? "#667eea" : "#bdc3c7"
                          }}
                        >
                          {isPlaying && video.url === selectedVideo.url ? (
                            <PauseIcon />
                          ) : (
                            <PlayArrowIcon />
                          )}
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Video Player */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "#1a1a1a"
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Video Title Bar */}
              <Box sx={{
                p: 3,
                background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                color: "white"
              }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {selectedVideo.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={selectedVideo.duration || "00:00"}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                  {selectedVideo.completed && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="مكتمل"
                      size="small"
                      sx={{ bgcolor: "#27ae60", color: "white" }}
                    />
                  )}
                </Box>
              </Box>

              {/* Video Container */}
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  bgcolor: "#000",
                }}
              >
                {selectedVideo.url ? (
                  // <iframe
                  //   src={selectedVideo.url}
                  //   title={selectedVideo.title}

                  //   controlsList="nodownload"
                  //   style={{
                  //     position: "absolute",
                  //     top: 0,
                  //     left: 0,
                  //     width: "100%",
                  //     height: "100%",
                  //     border: "none",
                  //   }}
                  //   allowFullScreen
                  // />
                  <video
                    id="safeVideo"
                    src={selectedVideo.url}
                    autoPlay
                    playsInline
                    controls={true}
                    disablePictureInPicture
                    controlsList="nodownload "
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      // pointerEvents: "none", // Prevents pause/seek
                    }}
                    onEnded={() => {
                      const video = document.getElementById("safeVideo") as HTMLVideoElement;
                      video.controls = true;
                      video.style.pointerEvents = "auto";
                    }}
                  />

                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      bgcolor: "#2c3e50",
                      color: "white"
                    }}
                  >
                    <VideoLibraryIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ opacity: 0.7 }}>
                      لا يوجد فيديو متاح
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Download Section */}
              {(selectedVideo.docUrl || selectedVideo.txtUrl) && (
                <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />
                  <Typography
                    variant="h6"
                    gutterBottom
                    textAlign="center"
                    sx={{ color: "white", mb: 3 }}
                  >
                    الملفات المرفقة
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                  }}>
                    {selectedVideo.docUrl && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => handleDownload(selectedVideo.docUrl!, `${selectedVideo.title}-document.pdf`)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #c0392b 0%, #a93226 100%)",
                          }
                        }}
                      >
                        تحميل المستند
                      </Button>
                    )}
                    {selectedVideo.txtUrl && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DescriptionIcon />}
                        onClick={() => handleDownload(selectedVideo.txtUrl!, `${selectedVideo.title}-notes.txt`)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)",
                          }
                        }}
                      >
                        تحميل الملاحظات
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoShow;