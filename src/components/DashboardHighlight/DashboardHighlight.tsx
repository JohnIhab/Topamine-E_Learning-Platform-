import { Box, Paper, Typography, Stack, Avatar, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useThemeMode } from '../../context/ThemeContext';

const DashboardHighlight: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 5,
        minWidth: 400,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)',
        boxShadow: isDarkMode
          ? '0 2px 12px rgba(0, 0, 0, 0.3)'
          : '0 2px 12px rgba(25, 118, 210, 0.08)',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
          <TrendingUpIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            نمو الطلاب
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            معدل الزيادة هذا الشهر
          </Typography>
        </Box>
      </Stack>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
        +24%
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        مقارنة بالشهر الماضي
      </Typography>
    </Paper>
  );
};

export default DashboardHighlight;