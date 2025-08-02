import React, { useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
} from "@mui/material";

type Video = {
  title: string;
  url: string;
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
              {videoList.map((video, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={video.url === selectedVideo.url}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <ListItemText
                      primary={video.title}
                      sx={{ textAlign: "center", paddingLeft: "17%" }}
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoShow;
