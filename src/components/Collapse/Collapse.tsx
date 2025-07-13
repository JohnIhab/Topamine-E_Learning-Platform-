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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LightModeIcon from '@mui/icons-material/LightMode';


interface CustomCollapseProps {
  title?: string;
}

const CustomCollapse: React.FC<CustomCollapseProps> = ({ title = "البلاغة-النداء--محمد صلاح 2.5ث" }) => { 
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
          backgroundColor: '#f1f1f1'
        }}
        onClick={() => setOpen(!open)}
      >
         {/* {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
        <Typography variant="subtitle1">{title}</Typography>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
       
      </Stack>

      <MUICollapse in={open}>
        <Box sx={{ mt: 1, display:"flex",  justifyContent:"flex-end"}}>
          <List>
            <ListItem>
              <Stack direction="row" spacing={1} >
              <ListItemText primary="الوصف" />
                <ErrorOutlineIcon/>
              
              </Stack>
           
            </ListItem>

            <ListItem>
              <Stack direction="row" spacing={1} alignItems="center">
               
                 <ListItemText primary="مدة الفديو "/>
                < AccessTimeIcon/>
               
              </Stack>
            </ListItem>

            <ListItem>
              <Stack direction="row" spacing={1} alignItems="center">
               
                     <ListItemText primary="عدد المشاهدات" />
                <PeopleAltIcon/>
           
              </Stack>
            </ListItem>
               <ListItem>
              <Stack direction="row" spacing={1} alignItems="center">
                
                <ListItemText primary="اجمالي وقت المشاهدة"/>
                <LightModeIcon/>
                
              </Stack>
            </ListItem>
          </List>
        </Box>
      </MUICollapse>
    </Box>
  );
}

export default CustomCollapse; 