import React, { useState } from "react";
import mainImg from '../../assets/images/Icon-logo.png'
import { motion } from "framer-motion";


import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    Button,
    TextField,
    MenuItem,
    Box,
} from "@mui/material";

const teacherCards = [
    {
        name: "أ. أحمد السيد",
        title: "مدرس فيزياء",
        handle: "ahmedphysics",


        avatarUrl: mainImg,
    },
    {
        name: "أ. منى علي",
        title: "مدرسة أحياء",
        handle: "monabiology",


        avatarUrl: mainImg,
    },
    {
        name: "أ. خالد سامي",
        title: "مدرس رياضيات",
        handle: "khaledmath",


        avatarUrl: mainImg,
    },
    {
        name: "أ. نورهان محمد",
        title: "مدرسة كيمياء",
        handle: "norhanchem",


        avatarUrl: mainImg,
    },
    {
        name: "أ. عمر عبد الله",
        title: "مدرس إنجليزي",
        handle: "omarenglish",


        avatarUrl: mainImg,
    },
    {
        name: "أ. نورهان محمد",
        title: "مدرسة كيمياء",
        handle: "norhanchem",


        avatarUrl: mainImg,
    },
    {
        name: "أ. عمر عبد الله",
        title: "مدرس إنجليزي",
        handle: "omarenglish",


        avatarUrl: mainImg,
    },
    {
        name: "أ. نورهان محمد",
        title: "مدرسة كيمياء",
        handle: "norhanchem",


        avatarUrl: mainImg,
    },
    {
        name: "أ. عمر عبد الله",
        title: "مدرس إنجليزي",
        handle: "omarenglish",


        avatarUrl: mainImg,
    },
    {
        name: "أ. نورهان محمد",
        title: "مدرسة كيمياء",
        handle: "norhanchem",


        avatarUrl: mainImg,
    },
    {
        name: "أ. عمر عبد الله",
        title: "مدرس إنجليزي",
        handle: "omarenglish",


        avatarUrl: mainImg,
    },
    {
        name: "أ. نورهان محمد",
        title: "مدرسة كيمياء",
        handle: "norhanchem",


        avatarUrl: mainImg,
    },
    {
        name: "أ. عمر عبد الله",
        title: "مدرس إنجليزي",
        handle: "omarenglish",


        avatarUrl: mainImg,
    },

];

const uniqueSubjects = [...new Set(teacherCards.map((card) => card.title))];

export default function TeacherSec() {
    const [visibleCount, setVisibleCount] = useState(4);
    const [nameFilter, setNameFilter] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");

    const filteredCards = teacherCards.filter((card) => {
        const nameMatch = card.name.includes(nameFilter);
        const subjectMatch = subjectFilter ? card.title === subjectFilter : true;
        return nameMatch && subjectMatch;
    });

    const handleSeeMore = () => {
        setVisibleCount((prev) => Math.min(prev + 4, filteredCards.length));
    };


    return (
        <Box sx={{ padding: 3, width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                            scale: [0.8, 1.1, 0.9, 1],
                            opacity: [0.5, 0.8, 0.6, 0.7],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                        }}
                        style={{
                            position: "absolute",
                            top: "30%",
                            width: "110%",
                            height: "70%",
                            backgroundColor: "#60a5fa",
                            borderRadius: "30%",
                            transform: "translate(-50%, -50%)",
                            zIndex: -1,
                            filter: "blur(15px)",
                        }}
                    />
                    <Typography
                        variant="h3"
                        color="#60a5fa"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            userSelect: "none",
                            position: "relative",
                            px: 2,
                        }}
                    >
                        المدرسين
                    </Typography>
                </Box>
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 3
            }}>
                <Box sx={{
                    display: "flex",
                    gap: 2,
                    width: {
                        xs: '100%',
                        sm: '80%',
                        md: '60%',
                        lg: '40%',
                    },
                    flexDirection: {
                        xs: 'column',
                        sm: 'row'
                    }
                }}>
                    <TextField
                        label="فلترة بالاسم"
                        variant="outlined"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="فلترة بالمادة"
                        select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">الكل</MenuItem>
                        {uniqueSubjects.map((subject, i) => (
                            <MenuItem key={i} value={subject}>
                                {subject}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>


            <Grid container spacing={2} justifyContent="center">
                {filteredCards.slice(0, visibleCount).map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ minWidth: 300, maxHeight: 300, mx: 'auto' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={card.avatarUrl}
                                alt={card.name}
                                sx={{ objectFit: 'fill' }}
                            />
                            <CardContent >
                                <Typography variant="h6" gutterBottom>
                                    {card.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.title}
                                </Typography>


                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            {filteredCards.length === 0 && (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h6" color="text.secondary">
                        لا يوجد نتائج
                    </Typography>
                </Box>
            )}

            {visibleCount < filteredCards.length && (
                <Box textAlign="center" mt={4}>
                    <Button variant="outlined" onClick={handleSeeMore}>
                        عرض المزيد
                    </Button>
                </Box>
            )}
        </Box>
    );
}
