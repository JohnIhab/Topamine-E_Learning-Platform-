import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import backgroundSvg from "../../assets/images/footer.png";

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
                        <Typography variant="h6" gutterBottom>
                            روابط سريعة
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover">
                                الرئيسية
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                المعلمون
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                تواصل معنا
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                الشروط والأحكام
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            تواصل معنا
                        </Typography>
                        <Typography variant="body2">البريد الإلكتروني: support@example.com</Typography>
                        <Typography variant="body2">الهاتف: +20 123 456 7890</Typography>
                        <Typography variant="body2">العنوان: القاهرة، مصر</Typography>
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
