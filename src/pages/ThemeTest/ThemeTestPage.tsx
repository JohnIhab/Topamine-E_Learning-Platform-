import React from 'react';
import { Box, Typography, Card, CardContent, Button, Paper, Container } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

const ThemeTestPage: React.FC = () => {
  const { isDarkMode } = useThemeMode();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Toggle */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: 1
      }}>
        <Typography variant="h4" component="h1" color="text.primary">
          اختبار النمط {isDarkMode ? '(الوضع المظلم)' : '(الوضع المضيء)'}
        </Typography>
        <ThemeToggle size="large" />
      </Box>

      {/* Demo Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="text.primary">
              بطاقة المثال الأول
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              هذا نص تجريبي لاختبار الألوان في الوضع الحالي. يجب أن تتغير الألوان تلقائياً عند تبديل النمط.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              زر أساسي
            </Button>
            <Button variant="outlined" color="secondary">
              زر ثانوي
            </Button>
          </CardContent>
        </Card>

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="text.primary">
              بطاقة المثال الثاني
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              هذا نص آخر لاختبار التباين والوضوح في النصوص والخلفيات.
            </Typography>
            <Button variant="contained" color="secondary" sx={{ mr: 1 }}>
              زر ملون
            </Button>
            <Button variant="text" color="primary">
              زر نص
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Info Panel */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="text.primary">
          معلومات النمط الحالي
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          النمط الحالي: <strong>{isDarkMode ? 'مظلم 🌙' : 'مضيء ☀️'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          هذا المثال يوضح كيفية عمل نظام التبديل بين الأنماط المختلفة. جرب النقر على أيقونة التبديل لرؤية التغيير!
        </Typography>
        
        <Box sx={{ mt: 3, p: 2, borderRadius: 1, backgroundColor: 'action.hover' }}>
          <Typography variant="subtitle2" color="text.primary">
            📍 مواقع أزرار التبديل:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • في شريط التنقل العلوي (بجانب زر "انضم الآن")
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • في صفحة Teacher Dashboard (أعلى اليسار)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • في هذه الصفحة (أعلى اليمين)
          </Typography>
        </Box>
      </Paper>

      {/* Color Palette Display */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="text.primary">
          عرض الألوان الحالية
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="subtitle2">اللون الأساسي</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'secondary.main', color: 'secondary.contrastText' }}>
            <Typography variant="subtitle2">اللون الثانوي</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2">الخلفية الافتراضية</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2">خلفية الورقة</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ThemeTestPage;
