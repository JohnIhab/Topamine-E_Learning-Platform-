import React, { useEffect, useState } from 'react';
import {
    Box,
} from '@mui/material';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,

} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { useTheme } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Chart: React.FC = () => {
    const [courseCount, setCourseCount] = useState<number>(0);
    const [totalPayments, setTotalPayments] = useState<number>(0);
    const [studentCount, setStudentCount] = useState<number>(0);

    const { user } = useAuth();
    const theme = useTheme();
    const { isDarkMode } = useThemeMode();

    useEffect(() => {
        if (!user?.uid) return;

        const coursesQuery = query(
            collection(db, "courses"),
            where("teacherId", "==", user.uid)
        );

        const unsub = onSnapshot(coursesQuery, (snapshot) => {
            setCourseCount(snapshot.docs.length);

            const courseIds = snapshot.docs.map((doc) => doc.id);

            if (courseIds.length > 0) {
                let enrollmentsQuery;
                if (courseIds.length <= 10) {
                    enrollmentsQuery = query(
                        collection(db, "enrollments"),
                        where("courseId", "in", courseIds)
                    );
                } else {
                    enrollmentsQuery = collection(db, "enrollments");
                }

                const enrollmentsUnsub = onSnapshot(enrollmentsQuery, (enrollmentsSnapshot) => {
                    const total = enrollmentsSnapshot.docs.reduce((sum, doc) => {
                        const enrollmentData = doc.data();
                        if (courseIds.includes(enrollmentData.courseId)) {
                            return sum + (enrollmentData.amount || 0);
                        }
                        return sum;
                    }, 0);
                    setTotalPayments(total);

                    const enrollmentsCount = enrollmentsSnapshot.docs.filter((doc) => {
                        const enrollmentData = doc.data();
                        return courseIds.includes(enrollmentData.courseId);
                    }).length;
                    setStudentCount(enrollmentsCount);
                });

                return () => enrollmentsUnsub();
            } else {
                setTotalPayments(0);
                setStudentCount(0);
            }
        });

        return () => unsub();
    }, [user?.uid]);

    const data = {
        labels: ["المدفوعات", "الكورسات", "الطلاب"],
        datasets: [
            {
                label: "الإحصائيات",
                data: [totalPayments, courseCount, studentCount],
                backgroundColor: isDarkMode
                    ? [
                        "rgba(139, 92, 246, 0.3)",
                        "rgba(34, 197, 94, 0.3)",
                        "rgba(251, 146, 60, 0.3)",
                    ]
                    : ["#fff3e0", "#f1f8e9", "#ffe0b2"],
                borderColor: isDarkMode
                    ? [
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(34, 197, 94, 0.8)",
                        "rgba(251, 146, 60, 0.8)",
                    ]
                    : ["#f57c00", "#689f38", "#ff9800"],
                borderWidth: 1,
            },
        ],
    };



    const options = {
        responsive: true,
        indexAxis: "x" as const,
        scales: { x: { beginAtZero: true } },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: theme.palette.text.primary,
                },
            },
            datalabels: {
                anchor: "end" as const,
                align: "right" as const,
                // formatter: (value: number, context: any) => {
                //   const total = context.chart.data.datasets[0].data.reduce(
                //     (a: number, b: number) => a + b,
                //     0
                //   );
                // const percentage = ((value / total) * 100).toFixed(1) + '%';
                // return percentage;
                // },
                color: theme.palette.text.primary,
                font: { weight: 'bold' as const, size: 14 },
            },
        },
    };

    return (
        <Box
            sx={{
                backgroundColor: "white",
                width: "75vw",
                height: 300,
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                mx: "auto",
                mt: 4,
            }}
        >
            <Bar data={data} options={options} />
        </Box>
    );
};

export default Chart;