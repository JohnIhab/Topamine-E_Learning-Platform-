import { Box, Paper, Typography, Stack, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DashboardHighlight: React.FC = () => (
  <Paper
    elevation={3}
    sx={{
      p: 5,
      minWidth: 400,
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)',
      boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
        <TrendingUpIcon fontSize="large" />
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          نمو الطلاب
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          معدل الزيادة هذا الشهر
        </Typography>
      </Box>
    </Stack>
    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
      +24%
    </Typography>
    <Typography variant="body2" sx={{ color: '#888' }}>
      مقارنة بالشهر الماضي
    </Typography>
  </Paper>
);

export default DashboardHighlight;