import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Fab,
    Box,
    Typography,
    IconButton,
    TextField,
    Avatar,
    CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import RobotIcon from '@mui/icons-material/SmartToy';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDT_K1WmbFE4sT1ekAU_UJvH6QN3hhvroY`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: userMessage.text }] }],
                    }),
                }
            );

            const data = await response.json();
            const botReply =
                data.candidates?.[0]?.content?.parts?.[0]?.text || '❗ لم يتم الحصول على رد.';

            const botMessage: Message = { text: botReply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { text: '❌ حدث خطأ في الاتصال', sender: 'bot' }]);
        }

        setLoading(false);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <Fab
                color="primary"
                onClick={handleOpen}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    zIndex: 1300,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <ChatIcon />
            </Fab>

            {/* Chat Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 420,
                        height: '75vh',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#0f0f23',
                        color: '#fff',
                    },
                }}
            >
                {/* Header */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    sx={{ borderBottom: '1px solid #2d3748', bgcolor: '#1a1a2e' }}
                >
                    <Typography variant="h6">🤖 مساعد التعليم الذكي</Typography>
                    <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Messages */}
                <DialogContent sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                    {messages.map((msg, i) => (
                        <Box
                            key={i}
                            display="flex"
                            justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                            mb={2}
                        >
                            <Box
                                display="flex"
                                alignItems="flex-end"
                                maxWidth="80%"
                                gap={1}
                                sx={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}
                            >
                                <Avatar sx={{
                                    bgcolor: msg.sender === 'user' ? '#667eea' : '#2d3748',
                                    border: msg.sender === 'bot' ? '2px solid #4fd1c7' : 'none'
                                }}>
                                    {msg.sender === 'user' ? <i className="fas fa-user" /> : <RobotIcon />}
                                </Avatar>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 3,
                                        bgcolor: msg.sender === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#2d3748',
                                        color: '#fff',
                                        borderBottomLeftRadius: msg.sender === 'user' ? 0 : 12,
                                        borderBottomRightRadius: msg.sender === 'user' ? 12 : 0,
                                        border: msg.sender === 'bot' ? '1px solid #2d3748' : 'none',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {msg.text}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                    {loading && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <RobotIcon sx={{ color: '#4fd1c7' }} />
                            <CircularProgress size={20} sx={{ color: '#4fd1c7' }} />
                        </Box>
                    )}
                    <div ref={endRef} />
                </DialogContent>

                {/* Input Area */}
                <Box p={2} display="flex" gap={1} borderTop="1px solid #2d3748" bgcolor="#1a1a2e">
                    <TextField
                        fullWidth
                        placeholder="اكتب سؤالك هنا..."
                        multiline
                        maxRows={4}
                        variant="outlined"
                        size="small"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        sx={{
                            bgcolor: '#16213e',
                            borderRadius: '24px',
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': {
                                    borderColor: '#2d3748',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#4fd1c7',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4fd1c7',
                                },
                            },
                            '& textarea::placeholder': {
                                color: '#a0aec0',
                            },
                        }}
                    />
                    <IconButton
                        onClick={sendMessage}
                        sx={{
                            bgcolor: '#4fd1c7',
                            color: '#0f0f23',
                            '&:hover': { bgcolor: '#38b2ac' },
                            alignSelf: 'flex-end',
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Dialog>
        </>
    );
};

export default Chatbot;
