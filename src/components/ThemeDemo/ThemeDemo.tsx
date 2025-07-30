import React from 'react';
import { Box, Typography, Card, CardContent, Button, Paper } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const ThemeDemo: React.FC = () => {
  const { isDarkMode } = useThemeMode();

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          مثال على النظام الملون {isDarkMode ? '(الوضع المظلم)' : '(الوضع المضيء)'}
        </Typography>
        <ThemeToggle />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              بطاقة المثال الأول
            </Typography>
            <Typography variant="body2" color="text.secondary">
              هذا نص تجريبي لاختبار الألوان في الوضع الحالي. يجب أن تتغير الألوان تلقائياً عند تبديل النمط.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              زر تجريبي
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              بطاقة المثال الثاني
            </Typography>
            <Typography variant="body2" color="text.secondary">
              هذا نص آخر لاختبار التباين والوضوح في النصوص والخلفيات.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              زر آخر
            </Button>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            لوحة منفصلة
          </Typography>
          <Typography variant="body2">
            هذه لوحة منفصلة لإظهار تأثير التغيير على المكونات المختلفة.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" color="primary">
              أساسي
            </Button>
            <Button size="small" variant="contained" color="secondary">
              ثانوي
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          معلومات النمط الحالي
        </Typography>
        <Typography>
          النمط الحالي: {isDarkMode ? 'مظلم' : 'مضيء'}
        </Typography>
        <Typography>
          هذا المثال يوضح كيفية عمل نظام التبديل بين الأنماط المختلفة.
        </Typography>
      </Box>
    </Box>
  );
};

export default ThemeDemo;
