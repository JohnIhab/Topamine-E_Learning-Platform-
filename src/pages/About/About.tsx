/** @jsxImportSource @emotion/react */
import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const AboutUs = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 10, direction: 'rtl' }}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    fontWeight={700}
                    color="primary"
                >
                    من نحن
                </Typography>
                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    mb={8}
                    sx={{ fontWeight: 400, fontSize: '1.2rem' }}
                >
                    توبامين هي منصتك الذكية للتعلم، حيث ندمج بين المعرفة والتكنولوجيا لنمنحك تجربة تعليمية ملهمة ومخصصة لمستقبلك.
                </Typography>
            </motion.div>

            <Grid container spacing={6} justifyContent="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
                {[
                    {
                        title: 'رؤيتنا',
                        text: 'بناء مجتمع معرفي مبتكر يمكّن الجميع من التعلم والتطور.',
                        bg: '#e3f2fd',
                    },
                    {
                        title: 'مهمتنا',
                        text: 'نقدّم محتوى تعليمي تفاعلي يلائم جميع المستويات التعليمية باستخدام أحدث الأدوات.',
                        bg: '#fff8e1',
                    },
                    {
                        title: 'قيمنا',
                        text: 'الشفافية، الشمول، الابتكار، وتمكين المتعلمين من تحقيق إمكاناتهم.',
                        bg: '#ede7f6',
                    },
                ].map((section, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 * index }}
                            viewport={{ once: true }}
                        >
                            <Paper
                                elevation={5}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderRadius: 4,
                                    backgroundColor: section.bg,
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
                                    {section.title}
                                </Typography>
                                <Typography color="text.secondary" fontSize={"1.05rem"}>
                                    {section.text}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Box mt={10} textAlign="center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                        مستعد للانضمام إلينا؟
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        كن جزءًا من رحلتنا التعليمية وابدأ بتجربة المحتوى المصمم خصيصًا لك.
                    </Typography>
                    <Link to="/">
                        <Box
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            fontSize: '1rem',
                            px: 4,
                            py: 1.5,
                            border: 'none',
                            borderRadius: 2,
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        ابدأ الآن
                    </Box>
                    </Link>
                    
                </motion.div>
            </Box>
        </Container>
    );
};

export default AboutUs;
