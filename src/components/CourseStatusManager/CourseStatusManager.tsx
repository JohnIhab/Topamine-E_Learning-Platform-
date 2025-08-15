import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { 
  expireCourseManually, 
  reactivateCourse 
} from '../../utils/courseStatusManager';
import { toast } from 'react-toastify';

interface CourseStatusManagerProps {
  courseId: string;
  courseTitle: string;
  currentStatus: string;
  endDate: Date;
  onStatusChanged: () => void;
}

const CourseStatusManager: React.FC<CourseStatusManagerProps> = ({
  courseId,
  courseTitle,
  currentStatus,
  endDate,
  onStatusChanged
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'expire' | 'reactivate' | null>(null);

  const isExpired = endDate <= new Date();
  const canReactivate = currentStatus === 'non-active' && !isExpired;

  const handleExpireCourse = async () => {
    try {
      setLoading(true);
      await expireCourseManually(courseId);
      toast.success('تم إنهاء الكورس بنجاح');
      onStatusChanged();
      setOpen(false);
    } catch (error) {
      console.error('Error expiring course:', error);
      toast.error('حدث خطأ أثناء إنهاء الكورس');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateCourse = async () => {
    try {
      setLoading(true);
      const success = await reactivateCourse(courseId);
      if (success) {
        toast.success('تم إعادة تفعيل الكورس بنجاح');
        onStatusChanged();
        setOpen(false);
      } else {
        toast.error('لا يمكن إعادة تفعيل الكورس - انتهت صلاحيته');
      }
    } catch (error) {
      console.error('Error reactivating course:', error);
      toast.error('حدث خطأ أثناء إعادة تفعيل الكورس');
    } finally {
      setLoading(false);
    }
  };

  const openExpireDialog = () => {
    setAction('expire');
    setOpen(true);
  };

  const openReactivateDialog = () => {
    setAction('reactivate');
    setOpen(true);
  };

  const handleConfirm = () => {
    if (action === 'expire') {
      handleExpireCourse();
    } else if (action === 'reactivate') {
      handleReactivateCourse();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          حالة الكورس:
        </Typography>
        
        <Chip
          label={currentStatus === 'active' ? 'نشط' : 'منتهي الصلاحية'}
          color={currentStatus === 'active' ? 'success' : 'warning'}
          size="small"
        />

        {isExpired && (
          <Chip
            label="انتهت الصلاحية"
            color="error"
            size="small"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {currentStatus === 'active' && (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={openExpireDialog}
          >
            إنهاء الكورس يدوياً
          </Button>
        )}

        {canReactivate && (
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={openReactivateDialog}
          >
            إعادة تفعيل الكورس
          </Button>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {action === 'expire' ? 'إنهاء الكورس' : 'إعادة تفعيل الكورس'}
        </DialogTitle>
        
        <DialogContent>
          {action === 'expire' && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                تحذير: هذا الإجراء سيؤدي إلى إنهاء الكورس وإلغاء تسجيل جميع الطلاب منه
              </Alert>
              <Typography>
                هل أنت متأكد من أنك تريد إنهاء الكورس "{courseTitle}"؟
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                سيتم:
              </Typography>
              <ul>
                <li>تغيير حالة الكورس إلى "منتهي الصلاحية"</li>
                <li>إلغاء تسجيل جميع الطلاب المسجلين</li>
                <li>إرسال إشعارات للطلاب</li>
              </ul>
            </>
          )}

          {action === 'reactivate' && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                سيتم إعادة تفعيل الكورس وإتاحته للطلاب مرة أخرى
              </Alert>
              <Typography>
                هل أنت متأكد من أنك تريد إعادة تفعيل الكورس "{courseTitle}"؟
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ملاحظة: سيحتاج الطلاب لإعادة التسجيل في الكورس يدوياً
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            إلغاء
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            color={action === 'expire' ? 'warning' : 'success'}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              action === 'expire' ? 'إنهاء الكورس' : 'إعادة التفعيل'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseStatusManager;
