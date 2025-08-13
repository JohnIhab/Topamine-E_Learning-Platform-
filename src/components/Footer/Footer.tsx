import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';
import backgroundSvg from "../../assets/images/footer.png";

const Footer = () => {
    const { isDarkMode } = useThemeMode();

    return (
        <Box sx={{
            color: 'white',
            py: 5,
            mt: 1,
            backgroundImage: `url(${backgroundSvg})`,
            backgroundSize: "fill",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                zIndex: 1,
            },
            '& > *': {
                position: 'relative',
                zIndex: 2,
            }
        }}>
            <Container maxWidth="lg">
                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 4,
                    '@media (max-width: 900px)': {
                        flexDirection: 'column'
                    }
                }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                        <Typography variant="h6" gutterBottom>
                            عن المنصة
                        </Typography>
                        <Typography variant="body2">
                            نحن نوفر أفضل المعلمين لجميع المواد، بأعلى جودة وبتجربة تعليمية فريدة من نوعها للطلاب في الوطن العربي.
                        </Typography>
                    </Box>

                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                            روابط سريعة
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link component={RouterLink} to="/home" sx={{ color: '#fff', textDecoration: 'none' }}>
                                الرئيسية
                            </Link>
                            <Link component={RouterLink} to="/home" sx={{ color: '#fff', textDecoration: 'none' }}>
                                المعلمون
                            </Link>
                            <Link component={RouterLink} to="/contact" sx={{ color: '#fff', textDecoration: 'none' }}>
                                تواصل معنا
                            </Link>
                        </Box>
                    </Box>

                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                        <Typography variant="h6" gutterBottom>
                            تواصل معنا
                        </Typography>
                        <Typography variant="body2">البريد الإلكتروني: johnihab.01@gmail.com</Typography>
                        <Typography variant="body2">الهاتف: +20 111 0797 455</Typography>
                    </Box>
                </Box>

                <Box mt={5} textAlign="center">
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        © {new Date().getFullYear()} جميع الحقوق محفوظة | منصتنا التعليمية
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
