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
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Stack, Typography, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import logo from '../../assets/images/Icon-logo.png';
import { useThemeMode } from '../../context/ThemeContext';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: `'Tajawal', 'sans-serif'`,
  },
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const drawerWidth = 280;

interface SideDrawerOnlyProps {
  window?: () => Window;
}

const SideDrawerOnly: React.FC<SideDrawerOnlyProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const globalTheme = useTheme();
  const { isDarkMode } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: 'الرئيسية', path: '/teacherdashboard', icon: <HomeIcon /> },
    { text: 'إدارة الكورسات', path: '/teacherdashboard/courses', icon: <SchoolIcon /> },
    { text: 'الطلاب', path: '/teacherdashboard/students', icon: <PeopleIcon /> },
    { text: 'الرسائل', path: '/teacherdashboard/messages', icon: <MessageIcon /> },
  ];

  const drawer = (
    <Box dir="rtl" sx={{ 
      backgroundColor: globalTheme.palette.background.paper, 
      minHeight: '100vh', 
      height: '100vh',
      borderRight: isDarkMode ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)'
    }}>
      <Stack direction="row" spacing={5} sx={{ mt: 6, mr: 4, alignItems: 'center' }}>
        <img src={logo} width={70} alt="الشعار" />
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: globalTheme.palette.primary.main,
            fontFamily: 'Tajawal',
          }}
        >
          توبامين
        </Typography>
      </Stack>

      <Box sx={{ mt: 8 }}>
        <Divider sx={{ borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(229, 231, 235, 0.8)' }} />
      </Box>

      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <List>
            {drawerItems.map((item) => (
              <ListItem key={item.text} disablePadding >
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    width: '100%',
                    background: isActive 
                      ? (isDarkMode ? 'rgba(79, 70, 229, 0.2)' : '#F3F4FF') 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                  })}
                >
                  <ListItemButton
                    selected={location.pathname === item.path}
                    sx={{
                      '&:hover .MuiTypography-root': {
                        color: globalTheme.palette.primary.main,
                      },
                      '&:hover .MuiSvgIcon-root': {
                        color: globalTheme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: location.pathname === item.path 
                          ? globalTheme.palette.primary.main 
                          : globalTheme.palette.text.secondary,
                        minWidth: '35px',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        sx: {
                          color: location.pathname === item.path 
                            ? globalTheme.palette.primary.main 
                            : globalTheme.palette.text.secondary,
                          fontWeight: 500,
                          fontSize: "16px",
                          fontFamily: 'Tajawal',
                        }
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
          </List>
        </ThemeProvider>
      </CacheProvider>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ 
      display: 'flex', 
      backgroundColor: globalTheme.palette.background.default, 
      direction: 'rtl', 
      height: '100%' 
    }}>
      <CssBaseline />

      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={handleDrawerToggle}
        sx={{
          m: 2,
          display: { sm: 'none' },
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1300,
          color: globalTheme.palette.text.primary
        }}
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: globalTheme.palette.background.default
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: globalTheme.palette.background.default,
            border: 'none',
            position: 'relative'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideDrawerOnly; 