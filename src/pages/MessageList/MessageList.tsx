import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../../firebase'
import { Box, Typography, useTheme } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';

interface MessageListProps {
    chatId: string;
    currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ chatId, currentUserId }) => {
    const [messages, setMessages] = useState<DocumentData[]>([]);
    const theme = useTheme();
    const { isDarkMode } = useThemeMode();

    useEffect(() => {
        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => doc.data());
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [chatId]);

    return (
        <Box 
            p={2} 
            maxHeight="400px" 
            overflow="auto" 
            border={`1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.3)' : '#ccc'}`} 
            borderRadius="8px"
            sx={{
                backgroundColor: theme.palette.background.paper,
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: isDarkMode ? 'rgba(148, 163, 184, 0.5)' : '#c1c1c1',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: isDarkMode ? 'rgba(148, 163, 184, 0.7)' : '#a8a8a8',
                },
            }}
        >
            {messages.map((msg, index) => (
                <Box
                    key={index}
                    textAlign={msg.senderId === currentUserId ? 'right' : 'left'}
                    mb={1}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            backgroundColor: msg.senderId === currentUserId 
                                ? theme.palette.primary.main 
                                : (isDarkMode ? 'rgba(55, 65, 81, 0.8)' : '#e0e0e0'),
                            color: msg.senderId === currentUserId 
                                ? '#fff' 
                                : theme.palette.text.primary,
                            borderRadius: '12px',
                            maxWidth: '75%',
                        }}
                    >
                        {msg.text}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;
