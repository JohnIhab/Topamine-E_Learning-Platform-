
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Collapse as MUICollapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LightModeIcon from '@mui/icons-material/LightMode';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

interface CustomCollapseProps {
  title?: string;
  videoUrl?: string;
  pdfUrl?: string;
  txtUrl?: string;
}

const CustomCollapse: React.FC<CustomCollapseProps> = ({
  title = "محاضرة",
  videoUrl,
  pdfUrl,
  txtUrl
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 2,
          border: '1px solid gray',
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: '#f9f9f9'
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="subtitle1">{title}</Typography>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Stack>

      <MUICollapse in={open}>
        <Box sx={{ mt: 2 }}>
          <List>

          
            <ListItem>
              <Stack direction="row" spacing={1}>
                <ListItemText primary="الوصف" />
                <ErrorOutlineIcon />
              </Stack>
            </ListItem>

      {videoUrl && (
  <ListItem>
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        فيديو المحاضرة
      </Typography>
      <video
        src={videoUrl}
        controls
        style={{
          width: '100%',
          maxWidth: '100%',
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
          marginBottom: 16
        }}
      />
    </Box>
  </ListItem>
)}



       
            {pdfUrl && (
              <ListItem>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PictureAsPdfIcon color="error" />
                  <Typography>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      عرض ملف PDF
                    </a>
                  </Typography>
                </Stack>
              </ListItem>
            )}

         
            {txtUrl && (
              <ListItem>
                <Stack direction="row" spacing={1} alignItems="center">
                  <DescriptionIcon color="primary" />
                  <Typography>
                    <a
                      href={txtUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      عرض ملف TXT
                    </a>
                  </Typography>
                </Stack>
              </ListItem>
            )}

         
            <ListItem>
              <Stack direction="row" spacing={1}>
                <ListItemText primary="عدد المشاهدات" />
                <PeopleAltIcon />
              </Stack>
            </ListItem>

         
            <ListItem>
              <Stack direction="row" spacing={1}>
                <ListItemText primary="إجمالي وقت المشاهدة" />
                <LightModeIcon />
              </Stack>
            </ListItem>

          </List>
        </Box>
      </MUICollapse>
    </Box>
  );
};

export default CustomCollapse;
