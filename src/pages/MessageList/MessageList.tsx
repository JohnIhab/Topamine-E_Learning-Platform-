import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../../firebase'
import { Box, Typography } from '@mui/material';

interface MessageListProps {
    chatId: string;
    currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ chatId, currentUserId }) => {
    const [messages, setMessages] = useState<DocumentData[]>([]);

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
        <Box p={2} maxHeight="400px" overflow="auto" border="1px solid #ccc" borderRadius="8px">
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
                            backgroundColor: msg.senderId === currentUserId ? '#1976d2' : '#e0e0e0',
                            color: msg.senderId === currentUserId ? '#fff' : '#000',
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
