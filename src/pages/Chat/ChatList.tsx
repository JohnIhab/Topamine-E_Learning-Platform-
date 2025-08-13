import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Paper,
    AppBar,
    Toolbar,
    Badge,
    CircularProgress,
    TextField,
    InputAdornment,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

interface ChatData {
    id: string;
    participants: string[];
    studentName: string;
    teacherName: string;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount?: number;
}

const ChatList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth() as any;
    const theme = useTheme();
    const { isDarkMode } = useThemeMode();

    const [chats, setChats] = useState<ChatData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (!user?.uid) return;

        const chatsRef = collection(db, 'chats');
        const q = query(
            chatsRef,
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTime', 'desc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatList: ChatData[] = [];

            for (const docSnap of snapshot.docs) {
                const chatData = docSnap.data();

                const messagesRef = collection(db, 'chats', docSnap.id, 'messages');
                const unreadQuery = query(
                    messagesRef,
                    where('senderId', '!=', user.uid),
                    where('read', '==', false)
                );

                try {
                    const unreadSnapshot = await getDocs(unreadQuery);
                    const unreadCount = unreadSnapshot.size;

                    chatList.push({
                        id: docSnap.id,
                        ...chatData,
                        unreadCount
                    } as ChatData);
                } catch (error) {
                    chatList.push({
                        id: docSnap.id,
                        ...chatData,
                        unreadCount: 0
                    } as ChatData);
                }
            }

            setChats(chatList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredChats = chats.filter((chat) => {
        const searchLower = searchValue.toLowerCase();
        const otherParticipantName = user?.role === 'teacher'
            ? chat.studentName
            : chat.teacherName;

        return otherParticipantName?.toLowerCase().includes(searchLower);
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            height: '100vh', 
            direction: 'rtl',
            backgroundColor: theme.palette.background.default
        }}>
            {/* Header */}
            <AppBar position="static" sx={{ 
                backgroundColor: theme.palette.primary.main,
                boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        المحادثات
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Search */}
            <Box sx={{ 
                p: 2,
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.8)'}`
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="البحث في المحادثات..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: theme.palette.background.paper,
                            '& fieldset': {
                                borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(229, 231, 235, 0.8)',
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: theme.palette.text.secondary,
                            opacity: 1,
                        }
                    }}
                />
            </Box>

            {/* Chat List */}
            <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                backgroundColor: theme.palette.background.default
            }}>
                {filteredChats.length === 0 ? (
                    <Box sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        backgroundColor: theme.palette.background.paper,
                        margin: 2,
                        borderRadius: 2
                    }}>
                        <Typography color="text.secondary">
                            لا توجد محادثات حتى الآن
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {filteredChats.map((chat) => {
                            const otherParticipantName = user?.role === 'teacher'
                                ? chat.studentName
                                : chat.teacherName;

                            return (
                                <ListItem
                                    key={chat.id}
                                    onClick={() => navigate(`/chat/${chat.id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : '#f5f5f5',
                                        },
                                        borderBottom: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : '#eee'}`,
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            badgeContent={chat.unreadCount || 0}
                                            color="error"
                                            invisible={!chat.unreadCount || chat.unreadCount === 0}
                                        >
                                            <Avatar>
                                                {otherParticipantName?.charAt(0) || 'م'}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={chat.unreadCount && chat.unreadCount > 0 ? 'bold' : 'normal'}
                                                sx={{ color: theme.palette.text.primary }}
                                            >
                                                {otherParticipantName || 'مستخدم'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '200px',
                                                        fontWeight: chat.unreadCount && chat.unreadCount > 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {chat.lastMessage || 'لا توجد رسائل'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTime(chat.lastMessageTime)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default ChatList;