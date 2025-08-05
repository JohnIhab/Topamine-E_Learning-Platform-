import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Typography,
    Toolbar,
    Box,
    Stack,
    TextField,
    Autocomplete,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Avatar,
    IconButton,
    Badge,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";
import SearchIcon from "@mui/icons-material/search";
import InputAdornment from "@mui/material/InputAdornment";
import ChatIcon from "@mui/icons-material/Chat";
import { collection, getDocs, query, where, onSnapshot, doc as firestoreDoc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

interface ChatData {
    id: string;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount?: number;
    studentName?: string;
    studentEmail?: string;
}

export default function Messages() {
    const { user } = useAuth() as any;
    const navigate = useNavigate();
    const [chats, setChats] = useState<ChatData[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.uid) {
                console.log('No user found in Messages component');
                setLoading(false);
                return;
            }

            console.log('Fetching chats for user:', user.uid);
            console.log('User role:', user.role);

            try {
                const chatsRef = collection(db, 'chats');

                const allChatsQuery = await getDocs(chatsRef);
                console.log('Total chats in database:', allChatsQuery.size);

                if (allChatsQuery.size > 0) {
                    console.log('Sample chat documents:');
                    allChatsQuery.docs.slice(0, 3).forEach(doc => {
                        console.log(doc.id, doc.data());
                    });
                }

                const q = query(chatsRef);

                const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                    console.log('Chat query results:', querySnapshot.size, 'documents found');

                    if (querySnapshot.empty) {
                        console.log('No chat documents found for this user');
                        setChats([]);
                        setLoading(false);
                        return;
                    }

                    const chatList: ChatData[] = [];

                    for (const doc of querySnapshot.docs) {
                        const chatData = doc.data() as ChatData;
                        console.log('Chat document:', doc.id, chatData);

                        const isTeacherInChat = doc.id.endsWith(`_${user.uid}`) || doc.id.startsWith(`${user.uid}_`);

                        if (!isTeacherInChat) {
                            console.log('Skipping chat - teacher not involved');
                            continue;
                        }

                        const studentId = doc.id.split('_')[0];

                        let studentName = 'طالب';
                        let studentEmail = '';

                        try {
                            const userDocRef = firestoreDoc(db, 'users', studentId);
                            const userDocSnap = await getDoc(userDocRef);

                            if (userDocSnap.exists()) {
                                const studentData = userDocSnap.data() as any;
                                studentName = studentData.name || studentData.displayName || 'طالب';
                                studentEmail = studentData.email || '';
                            }
                        } catch (error) {
                            console.error('Error fetching student data:', error);
                        }

                        try {
                            const messagesRef = collection(db, 'chats', doc.id, 'messages');
                            const unreadQuery = query(
                                messagesRef,
                                where('createdBy', '!=', user.uid)
                            );

                            const unreadSnapshot = await getDocs(unreadQuery);
                            const unreadCount = unreadSnapshot.size;
                            console.log('Unread count for chat', doc.id, ':', unreadCount);

                            chatList.push({
                                ...chatData,
                                id: doc.id,
                                unreadCount,
                                studentName,
                                studentEmail
                            });
                        } catch (error) {
                            console.error('Error counting unread messages:', error);
                            chatList.push({
                                ...chatData,
                                id: doc.id,
                                unreadCount: 0,
                                studentName,
                                studentEmail
                            });
                        }
                    }

                    console.log('Final chat list:', chatList);
                    setChats(chatList);
                    setLoading(false);
                }, (error) => {
                    console.error('Error in chat listener:', error);
                    setLoading(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('خطأ في جلب المحادثات:', error);
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    const filteredChats = chats.filter((chat) => {
        const searchLower = searchValue.toLowerCase();
        return (
            chat.studentName?.toLowerCase().includes(searchLower) ||
            chat.studentEmail?.toLowerCase().includes(searchLower)
        );
    });

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';

        let date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            return '';
        }

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 24) {
            return date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('ar-EG');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                }}
            >
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: "#FFFFFF",
                        borderBottom: "1px solid rgba(157, 180, 206, 0.57)",
                        boxShadow: "none",
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                color: "#4F46E5",
                                fontWeight: "bold",
                            }}
                        >
                            الرسائل
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Stack spacing={2}>
                            <Autocomplete
                                freeSolo
                                disableClearable
                                options={chats.map((chat) => chat.studentName || "")}
                                onInputChange={(_event, newInputValue) => {
                                    setSearchValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="ابحث عن طالب..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: "gray" }} />
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                ...params.inputProps,
                                                type: "search",
                                            },
                                        }}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                height: "50px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(134, 145, 160, 0.57)",
                                                color: "#4F46E5",
                                                paddingX: 1,
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "gray",
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "gray",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                                        الطالب
                                    </TableCell>
                                    <TableCell sx={{ width: "25%", textAlign: "center" }}>
                                        البريد الإلكتروني
                                    </TableCell>
                                    <TableCell sx={{ width: "30%", textAlign: "center" }}>
                                        آخر رسالة
                                    </TableCell>
                                    <TableCell sx={{ width: "15%", textAlign: "center" }}>
                                        الوقت
                                    </TableCell>
                                    <TableCell sx={{ width: "10%", textAlign: "center" }}>
                                        الإجراءات
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                                            جاري التحميل...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredChats.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                                            لا توجد رسائل حتى الآن
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredChats.map((chat) => (
                                        <TableRow key={chat.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                            <TableCell sx={{ width: "20%", textAlign: "center" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {chat.studentName?.charAt(0) || 'ط'}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {chat.studentName || 'طالب'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ width: "25%", textAlign: "center" }}>
                                                {chat.studentEmail || 'غير محدد'}
                                            </TableCell>
                                            <TableCell sx={{ width: "30%", textAlign: "center" }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: '200px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: chat.unreadCount && chat.unreadCount > 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {chat.lastMessage || 'لا توجد رسائل'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ width: "15%", textAlign: "center" }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTime(chat.lastMessageTime)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ width: "10%", textAlign: "center" }}>
                                                <Badge
                                                    badgeContent={chat.unreadCount || 0}
                                                    color="error"
                                                    invisible={!chat.unreadCount || chat.unreadCount === 0}
                                                >
                                                    <IconButton
                                                        onClick={() => navigate(`/chat/${chat.id}`)}
                                                        sx={{ color: "#4F46E5" }}
                                                        title="فتح المحادثة"
                                                    >
                                                        <ChatIcon />
                                                    </IconButton>
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
