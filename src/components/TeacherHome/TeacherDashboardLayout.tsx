import React from 'react';
import { Box, Stack } from '@mui/material';
import Header from '../Header/Header';
import ResponsiveDrawer from '../Aside/ResponsiveDrawer';
import { Outlet } from 'react-router-dom';

const drawerWidth = 280;

const TeacherDashboardLayout: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Stack direction="row" sx={{ width: '100%' }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: { xs: 0, sm: drawerWidth }, 
          flexShrink: 0,
          position: { xs: 'fixed', sm: 'static' },
          zIndex: { xs: 1200, sm: 'auto' },
          height: '100vh',
          right: 0
        }}>
          <ResponsiveDrawer />
        </Box>
        
        {/* Main Content Area */}
        <Box sx={{ 
          flex: 1,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: 0 },
          mr: { xs: 0, sm: 0 }
        }}>
          <Header />
          <Box sx={{ p: 3, overflowX: 'hidden' }}>
            <Outlet />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default TeacherDashboardLayout; 