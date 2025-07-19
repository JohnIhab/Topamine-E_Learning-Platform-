import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import MessageList from '../MessageList/MessageList';
import { getAuth } from 'firebase/auth';

const getChatId = (user1: string, user2: string): string =>
    [user1, user2].sort().join('_');

const FullChatPage: React.FC = () => {
    const { teacherId } = useParams();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [text, setText] = useState('');

    const currentUserId = currentUser?.uid;
    const chatId = currentUserId && teacherId ? getChatId(currentUserId, teacherId) : '';

    const sendMessage = async () => {
        if (!text.trim() || !chatId || !currentUserId) return;

        try {
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text,
                senderId: currentUserId,
                timestamp: serverTimestamp(),
            });
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!currentUserId || !teacherId) {
        return <Typography>جاري التحميل...</Typography>;
    }

    return (
        <Box p={2}>
            <Typography variant="h5" mb={2}>محادثة مع المدرس</Typography>

            <MessageList chatId={chatId} currentUserId={currentUserId} />

            <Box mt={2} display="flex" gap={1}>
                <TextField
                    fullWidth
                    label="اكتب رسالتك هنا"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <Button variant="contained" onClick={sendMessage}>
                    إرسال
                </Button>
            </Box>
        </Box>
    );
};

export default FullChatPage;
