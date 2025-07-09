/** @jsxImportSource @emotion/react */
import React from 'react';
import {
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    IconButton,
    useTheme,
} from '@mui/material';
import { LocationOn, Email, Phone, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const ContactUs = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 8, direction: 'rtl' }}>
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h3" align="center" gutterBottom fontWeight={600}>
                    تواصل معنا
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" mb={6}>
                    نحن هنا لدعم رحلتك التعليمية - سواء كنت طالبًا، معلمًا، أو مؤسسة.
                </Typography>
            </motion.div>

            <Grid container spacing={6}>
                <Grid size={8} item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                            <Typography fontWeight="bold" textAlign="center" variant="h6" gutterBottom>أرسل لنا رسالة</Typography>
                            <TextField fullWidth label="الاسم الكامل" margin="normal" variant="outlined" />
                            <TextField fullWidth label="البريد الإلكتروني" margin="normal" variant="outlined" />
                            <TextField fullWidth label="الموضوع" margin="normal" variant="outlined" />
                            <TextField
                                fullWidth
                                label="الرسالة"
                                margin="normal"
                                multiline
                                rows={4}
                                variant="outlined"
                            />
                            <Button variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3 }}>
                                إرسال الرسالة
                            </Button>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={4} item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, height: '100%', backgroundColor: '#f5f9ff ' }}>
                            <Typography variant="h6" gutterBottom>معلومات الاتصال</Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocationOn color="primary" sx={{ ml: 1 }} />
                                <Typography>123 شارع التعليم، حي الأكاديمية، نيويورك 10001</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Email color="primary" sx={{ ml: 1 }} />
                                <Typography>contact@eduplatform.com</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Phone color="primary" sx={{ ml: 1 }} />
                                <Typography>+1 (555) 123-4567</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <AccessTime color="primary" sx={{ ml: 1 }} />
                                <Typography>الاثنين - الجمعة: 9:00 صباحًا - 6:00 مساءً</Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Box my={8}>
                    <Typography variant="h5" align="center" gutterBottom>
                        موقعنا على الخريطة
                    </Typography>
                    <Box
                        component="iframe"
                        src="https://www.google.com/maps/embed?pb=!1m18..."
                        width="100%"
                        height="350"
                        style={{ border: 0, borderRadius: 10 }}
                        loading="lazy"
                        title="Google Maps"
                    />
                </Box>

                <Box textAlign="center" mt={6}>
                    <Typography variant="h5" gutterBottom>
                        تواصل معنا عبر وسائل التواصل
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={2}>
                        <IconButton color="primary" aria-label="LinkedIn"><LinkedIn /></IconButton>
                        <IconButton color="primary" aria-label="Twitter"><Twitter /></IconButton>
                        <IconButton color="primary" aria-label="Facebook"><Facebook /></IconButton>
                        <IconButton color="primary" aria-label="Instagram"><Instagram /></IconButton>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
};

export default ContactUs;
