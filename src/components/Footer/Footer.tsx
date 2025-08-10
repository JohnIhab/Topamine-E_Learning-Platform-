import React from 'react';
import { Box, Container, Typography, Grid, Link  } from '@mui/material';
import backgroundSvg from "../../assets/images/footer.png";
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box sx={{
            color: 'white',
            py: 5,
            mt: 1,
            backgroundImage: `url(${backgroundSvg})`,
            backgroundSize: "fill",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",

        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            عن المنصة
                        </Typography>
                        <Typography variant="body2">
                            نحن نوفر أفضل المعلمين لجميع المواد، بأعلى جودة وبتجربة تعليمية فريدة من نوعها للطلاب في الوطن العربي.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
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
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            تواصل معنا
                        </Typography>
                        <Typography variant="body2">البريد الإلكتروني: johnihab.01@gmail.com</Typography>
                        <Typography variant="body2">الهاتف: +20 111 0797 455</Typography>
                    </Grid>
                </Grid>

                <Box mt={5} textAlign="center">
                    <Typography variant="body2" color="gray">
                        © {new Date().getFullYear()} جميع الحقوق محفوظة | منصتنا التعليمية
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
