import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const theme = createTheme({
  direction: 'rtl',
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const drawerWidth = 260;

interface SideDrawerOnlyProps {
  window?: () => Window;
}

const SideDrawerOnly: React.FC<SideDrawerOnlyProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: 'الرئيسية', path: '/', icon: <HomeIcon  /> },
    { text: 'إدارة الكورسات', path: '/courseMangement', icon: <SchoolIcon /> },
    { text: 'الطلاب', path: '/students', icon: <PeopleIcon /> },
  ];

  const drawer = (
    <div dir="rtl">
      <Stack direction="row" spacing={5} sx={{ mt: 3, mr: 4, alignItems: 'center' }}>
        <img src="/images/Icon-logo.png" width={70} alt="الشعار" />
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#1976d2',
            fontFamily: 'Tajawal',
          }}
        >
          توبامين
        </Typography>
      </Stack>

      <Box sx={{ mt: 6}}>
        <Divider />
      </Box>

      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <List>
            {drawerItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    justifyContent: 'space-between',
                    px: 2,
                    bgcolor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: '#e3f2fd',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'unset',mt:2}}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ mt:2 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f5f5f5', direction: 'rtl' }}>
      <CssBaseline />

      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={handleDrawerToggle}
        sx={{ m: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        anchor="right"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideDrawerOnly; 