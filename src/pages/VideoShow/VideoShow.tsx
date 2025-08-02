import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { doc, getDoc } from 'firebase/firestore';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
// @ts-ignore
import { db } from '../../firebase';

type Video = {
  title: string;
  url: string;
  docUrl?: string;
  txtUrl?: string;
};

const videoList: Video[] = [
  {
    title: "الفيديو الأول",
    url: "https://www.youtube.com/embed/fp3DqbNVOxo",
  },
  {
    title: "الفيديو التاني",
    url: "https://www.youtube.com/embed/dKlKpTuYHUY",
  },
  {
    title: "الفيديو التالت",
    url: "https://www.youtube.com/embed/dKlKpTuYHUY",
  },
];

const VideoShow: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videoList[0]);
  const [courseData, setCourseData] = useState<any>(null);
  const location = useLocation();
  
  // Get courseId from navigation state
  const courseId = location.state?.courseId;

  console.log("🎥 VideoShow component loaded");
  console.log("📍 Location state:", location.state);
  console.log("🆔 Course ID from navigation:", courseId);

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
              const courseVideos = course.lectures.map((lecture: any) => ({
                title: lecture.title || 'فيديو بدون عنوان',
                url: lecture.videoUrl || '',
                docUrl: lecture.docUrl || '',
                txtUrl: lecture.txtUrl || ''
              })).filter((video: Video) => video.url); // Only include videos with URLs
              
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
    ? courseData.lectures.map((lecture: any) => ({
        title: lecture.title || 'فيديو بدون عنوان',
        url: lecture.videoUrl || '',
        docUrl: lecture.docUrl || '',
        txtUrl: lecture.txtUrl || ''
      })).filter((video: Video) => video.url)
    : videoList;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        padding: 3,
        bgcolor: "#f5f5f5",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={3} sx={{ height: "100%" }}>
        {/* list of videos */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center", width: "22vw" }}>
          <Paper
            elevation={4}
            sx={{
              height: "100%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h6" gutterBottom>
              قائمة الفيديوهات
            </Typography>
            <List sx={{ width: "100%" }}>
              {videosToShow.map((video: any, index: number) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={video.url === selectedVideo.url}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Typography variant="body1" textAlign="center">
                            {video.title}
                          </Typography>
                          {(video.docUrl || video.txtUrl) && (
                            <Chip 
                              icon={<DownloadIcon />} 
                              label="ملفات" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      sx={{ textAlign: "center" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* video*/}
        <Grid item xs={12} md={8} sx={{ width: "70vw" }}>
          <Paper
            elevation={4}
            sx={{
              height: "100%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h5" gutterBottom textAlign="center">
              {selectedVideo.title}
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%", // 16:9
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                mb: 2,
              }}
            >
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allowFullScreen
              />
            </Box>

            {/* Download Section */}
            {(selectedVideo.docUrl || selectedVideo.txtUrl) && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom textAlign="center">
                  الملفات المرفقة
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {selectedVideo.docUrl && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => handleDownload(selectedVideo.docUrl!, `${selectedVideo.title}-document.pdf`)}
                      sx={{ textTransform: 'none' }}
                    >
                      تحميل المستند
                    </Button>
                  )}
                  {selectedVideo.txtUrl && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DescriptionIcon />}
                      onClick={() => handleDownload(selectedVideo.txtUrl!, `${selectedVideo.title}-notes.txt`)}
                      sx={{ textTransform: 'none' }}
                    >
                      تحميل الملاحظات
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoShow;