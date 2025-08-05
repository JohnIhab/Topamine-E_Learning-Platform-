import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    AppBar,
    Toolbar,
    Divider,
    List,
    ListItem,
    CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

interface Message {
    id: string;
    message: string;
    createdBy: string;
    name: string;
    createdAt: any;
    emailUser: string;
}

const Chat: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth() as any;

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherParticipant, setOtherParticipant] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!chatId || !user?.uid) return;

        const [studentId, teacherId] = chatId.split('_');

        let otherParticipantId: string | undefined;
        let otherParticipantRole: string;

        if (user.uid === studentId) {
            otherParticipantId = teacherId;
            otherParticipantRole = 'teacher';
        } else if (user.uid === teacherId) {
            otherParticipantId = studentId;
            otherParticipantRole = 'student';
        }

        const fetchOtherParticipant = async () => {
            if (!otherParticipantId) return;

            try {
                const userDocRef = doc(db, 'users', otherParticipantId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    console.log('Other participant data:', userData.name);
                    setOtherParticipant({
                        id: otherParticipantId,
                        name: userData.name || userData.displayName || 'مستخدم',
                        email: userData.email || '',
                        role: otherParticipantRole,
                        avatar: userData.avatar || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching participant data:', error);
            }
        };

        if (otherParticipantId) {
            fetchOtherParticipant();
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList: Message[] = [];
            snapshot.forEach((doc) => {
                messageList.push({
                    id: doc.id,
                    ...doc.data()
                } as Message);
            });
            setMessages(messageList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId, user]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !chatId || !user?.uid) return;

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                emailUser: user.email,
                message: newMessage.trim(),
                name: user.displayName || user.name || 'مستخدم',
            });

            const chatRef = doc(db, 'chats', chatId);
            await updateDoc(chatRef, {
                lastMessage: newMessage.trim(),
                lastMessageTime: serverTimestamp()
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
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
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', direction: 'rtl', background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)' }}>

            {/* Header */}
            <AppBar position="static" elevation={0} sx={{ background: 'rgba(79, 70, 229, 0.8)', backdropFilter: 'blur(8px)' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2, color: '#fff' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Avatar
                        src={otherParticipant?.avatar || ''}
                        alt={otherParticipant?.name}
                        sx={{ mr: 2, width: 44, height: 44 }}
                    >
                        {otherParticipant?.name?.charAt(0) || 'م'}
                    </Avatar>

                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {otherParticipant?.name || 'جاري التحميل...'}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, color: '#e0e7ff' }}>
                            {otherParticipant?.role === 'teacher' ? 'معلم' : 'طالب'}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2, backdropFilter: 'blur(6px)', background: 'rgba(255,255,255,0.5)' }}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {messages.map((message) => {
                        const isSender = message.createdBy === user?.uid;
                        return (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isSender ? 'flex-start' : 'flex-end',
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 2,
                                        maxWidth: '75%',
                                        borderRadius: '20px',
                                        bgcolor: isSender ? '#4F46E5' : '#ffffff',
                                        color: isSender ? '#ffffff' : '#111827',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                        {message.message}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: 'block', mt: 1, opacity: 0.6, textAlign: 'left', fontSize: '0.75rem' }}
                                    >
                                        {message.createdAt?.toDate?.()?.toLocaleTimeString('ar-EG', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) || ''}
                                    </Typography>
                                </Paper>
                            </Box>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            {/* Divider */}
            <Divider sx={{ borderColor: '#E0E0E0' }} />

            {/* Message Input */}
            <Box sx={{ p: 2, backgroundColor: '#f9fafb', boxShadow: '0 -1px 4px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="اكتب رسالتك..."
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: 'white',
                                px: 2,
                            },
                        }}
                    />
                    <IconButton
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        sx={{
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            '&:hover': {
                                backgroundColor: '#4338ca',
                            },
                            '&:disabled': {
                                backgroundColor: '#e5e7eb',
                                color: '#9ca3af',
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>

    );
};

export default Chat;