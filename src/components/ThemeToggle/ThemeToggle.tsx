import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showTooltip = true 
}) => {
  const { toggleColorMode, isDarkMode } = useThemeMode();

  const toggleButton = (
    <IconButton 
      onClick={toggleColorMode} 
      color="inherit"
      size={size}
      sx={{
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'rotate(180deg)',
        },
      }}
    >
      {isDarkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );

  if (!showTooltip) {
    return toggleButton;
  }

  return (
    <Tooltip title={isDarkMode ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع المظلم'}>
      {toggleButton}
    </Tooltip>
  );
};

export default ThemeToggle;
