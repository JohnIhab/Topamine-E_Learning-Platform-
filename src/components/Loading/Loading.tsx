import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const Loading: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <CircularProgress />
            <Typography variant="body1" mt={2}>
                Loading...
            </Typography>
        </Box>
    );
};

export default Loading;
