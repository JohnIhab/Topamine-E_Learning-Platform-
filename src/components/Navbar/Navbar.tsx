import React from 'react';
import logo from '../../assets/images/Icon-logo.png';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; 
import ThemeToggle from '../ThemeToggle/ThemeToggle'; 

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { user, role } = useAuth();
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const navLinks = [
        { label: 'الرئيسية', path: '/' },
        { label: 'عن المنصة', path: '/about' },
        { label: 'تواصل معنا', path: '/contact' },
    ];

    const getDashboardLink = () => {
        if (role === 'teacher') return { label: 'لوحة المعلم', path: '/profileTeacher' };
        if (role === 'student') return { label: 'ملفي', path: '/profileStd' };
        if (role === 'admin') return { label: 'لوحة الادمن', path: '/admin' };
        return null;
    };

    const dashboardLink = getDashboardLink();

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#ffffff',
                color: '#000',
                direction: 'rtl',
                boxShadow: 'none',
                borderBottom: '1px solid #e0e0e0',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Link style={{ textDecoration: 'none' }} to="/">
                    <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#60a5fa' }}>
                            توبامين
                        </Typography>
                        <img width="50" src={logo} loading="lazy" alt="Topamine" />
                    </Box>
                </Link>

                {!isMobile && (
                    <Box display="flex" gap={4}>
                        {navLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <Button color="inherit">{item.label}</Button>
                            </Link>
                        ))}

                        {user && dashboardLink && (
                            <Link
                                to={dashboardLink.path}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <Button color="inherit">{dashboardLink.label}</Button>
                            </Link>
                        )}
                    </Box>
                )}

                {!isMobile && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <ThemeToggle />
                        
                        {!user ? (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#60a5fa',
                                        color: '#fff',
                                        borderRadius: '20px',
                                    }}
                                >
                                    انضم الآن
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                sx={{
                                    borderColor: '#60a5fa',
                                    color: '#60a5fa',
                                    borderRadius: '20px',
                                }}
                            >
                                تسجيل الخروج
                            </Button>
                        )}
                    </Box>
                )}

                {isMobile && (
                    <>
                        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                            <Box sx={{ width: 250, p: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                                    القائمة
                                </Typography>
                                <List>
                                    {navLinks.map((item, index) => (
                                        <ListItem button key={index} onClick={toggleDrawer}>
                                            <Link
                                                to={item.path}
                                                style={{ textDecoration: 'none', width: '100%' }}
                                            >
                                                <ListItemText
                                                    primary={item.label}
                                                    sx={{ textAlign: 'right' }}
                                                />
                                            </Link>
                                        </ListItem>
                                    ))}

                                    {user && dashboardLink && (
                                        <ListItem button onClick={toggleDrawer}>
                                            <Link
                                                to={dashboardLink.path}
                                                style={{ textDecoration: 'none', width: '100%' }}
                                            >
                                                <ListItemText
                                                    primary={dashboardLink.label}
                                                    sx={{ textAlign: 'right' }}
                                                />
                                            </Link>
                                        </ListItem>
                                    )}

                                    <ListItem>
                                        {!user ? (
                                            <Link
                                                to="/login"
                                                style={{ width: '100%', textDecoration: 'none' }}
                                            >
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#60a5fa', mt: 2 }}
                                                >
                                                    انضم الأن
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                fullWidth
                                                onClick={() => {
                                                    handleLogout();
                                                    toggleDrawer();
                                                }}
                                                variant="outlined"
                                                sx={{ color: '#60a5fa', mt: 2 }}
                                            >
                                                تسجيل الخروج
                                            </Button>
                                        )}
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
