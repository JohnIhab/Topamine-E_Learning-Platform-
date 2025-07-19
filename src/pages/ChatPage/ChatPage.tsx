import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'
import { Box, Button, TextField, Typography } from '@mui/material';

interface ChatPageProps {
    chatId: string;
    senderId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ chatId, senderId }) => {
    const [text, setText] = useState('');

    const sendMessage = async () => {
        if (!text.trim()) return;

        try {
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text,
                senderId,
                timestamp: serverTimestamp()
            });
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h6">Chat with teacher</Typography>

            <Box mt={2} display="flex" gap={1}>
                <TextField
                    fullWidth
                    label="اكتب رسالتك هنا"
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    إرسال
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
