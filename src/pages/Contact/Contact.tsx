// 
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
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
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import { LocationOn, Email, Phone, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
    const theme = useTheme();
    

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setSnackbar({
                open: true,
                message: 'يرجى ملء جميع الحقول المطلوبة',
                severity: 'error'
            });
            return;
        }
        
        setLoading(true);
        
        try {
            let contactEmailSent = false;
            let thankYouEmailSent = false;

            
            try {
                const contactUsParams = {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
                };
                
                console.log('Sending contact us email to owner...');
                await emailjs.send(
                    'service_exm4k1v', 
                    'template_uf9o6a6', 
                    contactUsParams,
                    '1vl0eb8WdRFGYJirb' 
                );
                console.log('Contact us email sent successfully');
                contactEmailSent = true;
            } catch (error) {
                console.error('Failed to send contact us email:', error);
            }

           
            try {
                const thankYouParams = {
                    name: formData.name,
                    email: formData.email,
                    to_email: formData.email, 
                    user_email: formData.email, 
                    reply_to: 'dinaabdulazizali@gmail.com'
                };
                
                console.log('Sending thank you email to user:', formData.email);
                await emailjs.send(
                    'service_exm4k1v', 
                    'template_y3n0ini', 
                    thankYouParams,
                    '1vl0eb8WdRFGYJirb' 
                );
                console.log('Thank you email sent successfully to:', formData.email);
                thankYouEmailSent = true;
            } catch (error) {
                console.error('Failed to send thank you email:', error);
            }


            if (contactEmailSent || thankYouEmailSent) {
                let successMessage = 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
                if (contactEmailSent && !thankYouEmailSent) {
                    successMessage = 'تم إرسال رسالتك بنجاح! (ملاحظة: لم يتم إرسال رسالة التأكيد)';
                } else if (!contactEmailSent && thankYouEmailSent) {
                    successMessage = 'تم إرسال رسالة التأكيد! (ملاحظة: قد تكون هناك مشكلة في إرسال الرسالة الأساسية)';
                }
                
                setSnackbar({
                    open: true,
                    message: successMessage,
                    severity: 'success'
                });
                
              
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error('Both emails failed to send');
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            setSnackbar({
                open: true,
                message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

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
                            <form onSubmit={handleSubmit}>
                                <TextField 
                                    fullWidth 
                                    label="الاسم الكامل" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    margin="normal" 
                                    variant="outlined" 
                                    required
                                    disabled={loading}
                                />
                                <TextField 
                                    fullWidth 
                                    label="البريد الإلكتروني" 
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    margin="normal" 
                                    variant="outlined" 
                                    required
                                    disabled={loading}
                                />
                                <TextField 
                                    fullWidth 
                                    label="الموضوع" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    margin="normal" 
                                    variant="outlined" 
                                    required
                                    disabled={loading}
                                />
                                <TextField
                                    fullWidth
                                    label="الرسالة"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                />
                                <Button 
                                    type="submit"
                                    variant="contained" 
                                    color="primary" 
                                    size="large" 
                                    fullWidth 
                                    sx={{ mt: 3 }}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                                </Button>
                            </form>
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
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, height: '100%', backgroundColor: '#4d88cfff ' }}>
                            <Typography variant="h6" gutterBottom>معلومات الاتصال</Typography>
                            
                            <Box display="flex" alignItems="center" mb={2}>
                                <Email color="primary" sx={{ ml: 1 }} />
                                <Typography>johnihab.01@gmail.com</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Phone color="primary" sx={{ ml: 1 }} />
                                <Typography>+20 111 0797 455</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <AccessTime color="primary" sx={{ ml: 1 }} />
                                <Typography>اي وقت</Typography>
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
            
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ContactUs;