import React from 'react'
import notFound from '../../assets/images/notFound.jpg'
import { Box } from '@mui/material'
import { GlobalStyles } from '@mui/system';

export default function NotFound() {

    return (
        <>
            <GlobalStyles
                styles={{
                    html: { margin: 0, padding: 0, overflow: 'hidden' },
                    body: { margin: 0, padding: 0, overflow: 'hidden' },
                    '#root': { height: '100vh' },
                }}
            />
            <Box
                component="img"
                src={notFound}
                alt="Full Screen"
                sx={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'fill',
                    display: 'block',
                }}
            />
        </>
    )
}
