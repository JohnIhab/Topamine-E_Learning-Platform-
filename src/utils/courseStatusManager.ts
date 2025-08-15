import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';


export const checkAndUpdateExpiredCourses = async (): Promise<void> => {
  try {
    console.log('Starting course expiration check...');
    
    const coursesRef = collection(db, 'courses');
    const activeCourses = query(coursesRef, where('status', '==', 'active'));
    const courseSnapshot = await getDocs(activeCourses);
    
    const now = new Date();
    const expiredCourses: string[] = [];
    
    for (const courseDoc of courseSnapshot.docs) {
      const courseData = courseDoc.data();
      const endDate = courseData.endDate?.toDate();
      
      if (endDate && endDate <= now) {
        expiredCourses.push(courseDoc.id);
        
        await updateDoc(doc(db, 'courses', courseDoc.id), {
          status: 'non-active',
          expiredAt: new Date()
        });
        
        console.log(`Course ${courseDoc.id} (${courseData.title}) marked as non-active`);
      }
    }
    

    if (expiredCourses.length > 0) {
      await notifyStudentsAboutCourseStatusChange(expiredCourses);
    }
    
    console.log(`Course expiration check completed. ${expiredCourses.length} courses expired.`);
    
  } catch (error) {
    console.error('Error checking expired courses:', error);
    throw error;
  }
};

const notifyStudentsAboutCourseStatusChange = async (expiredCourseIds: string[]): Promise<void> => {
  try {
    console.log(`Notifying students about ${expiredCourseIds.length} courses that became non-active...`);
    
    for (const courseId of expiredCourseIds) {
      const courseDoc = await getDocs(query(collection(db, 'courses'), where('__name__', '==', courseId)));
      let courseTitle = 'الكورس';
      
      if (!courseDoc.empty) {
        courseTitle = courseDoc.docs[0].data().title || 'الكورس';
      }
      
      const enrollmentsRef = collection(db, 'enrollments');
      const courseEnrollments = query(
        enrollmentsRef, 
        where('courseId', '==', courseId),
        where('paid', '==', 'enrolled')
      );
      const enrollmentSnapshot = await getDocs(courseEnrollments);
      
      for (const enrollmentDoc of enrollmentSnapshot.docs) {
        const enrollmentData = enrollmentDoc.data();
        const studentId = enrollmentData.uid || enrollmentData.studentId;
        
        if (studentId) {
          const notificationRef = collection(db, 'users', studentId, 'notifications');
          await addDoc(notificationRef, {
            title: `تغيير حالة الكورس: ${courseTitle}`,
            message: `أصبح الكورس "${courseTitle}" غير نشط، لكن يمكنك الاستمرار في الوصول إليه لأنك دفعت ثمنه.`,
            courseId: courseId,
            type: 'course_status_change',
            read: false,
            createdAt: new Date(),
          });
          
          console.log(`Sent notification to student ${studentId} about course ${courseId} status change`);
        }
      }
    }
    
    console.log('All course status change notifications sent successfully');
    
  } catch (error) {
    console.error('Error sending course status notifications:', error);
    throw error;
  }
};


export const getActiveCoursesEnrollmentCount = async (teacherId: string): Promise<{ [courseId: string]: number }> => {
  try {
    const coursesRef = collection(db, 'courses');
    const teacherCourses = query(
      coursesRef, 
      where('teacherId', '==', teacherId),
      where('status', '==', 'active')
    );
    const courseSnapshot = await getDocs(teacherCourses);
    
    const enrollmentCounts: { [courseId: string]: number } = {};
    
    for (const courseDoc of courseSnapshot.docs) {
      const enrollmentsRef = collection(db, 'enrollments');
      const courseEnrollments = query(
        enrollmentsRef,
        where('courseId', '==', courseDoc.id),
        where('paid', '==', 'enrolled')
      );
      const enrollmentSnapshot = await getDocs(courseEnrollments);
      
      enrollmentCounts[courseDoc.id] = enrollmentSnapshot.size;
    }
    
    return enrollmentCounts;
    
  } catch (error) {
    console.error('Error getting active courses enrollment count:', error);
    return {};
  }
};


export const expireCourseManually = async (courseId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'courses', courseId), {
      status: 'non-active',
      expiredAt: new Date(),
      manuallyExpired: true
    });
    
    await notifyStudentsAboutCourseStatusChange([courseId]);
    
    console.log(`Course ${courseId} manually expired`);
    
  } catch (error) {
    console.error(`Error manually expiring course ${courseId}:`, error);
    throw error;
  }
};


export const reactivateCourse = async (courseId: string): Promise<boolean> => {
  try {
    const courseDoc = await getDocs(query(collection(db, 'courses'), where('id', '==', courseId)));
    
    if (courseDoc.empty) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.docs[0].data();
    const endDate = courseData.endDate?.toDate();
    const now = new Date();
    
    if (endDate && endDate > now) {
      await updateDoc(doc(db, 'courses', courseId), {
        status: 'active',
        reactivatedAt: new Date()
      });
      
      console.log(`Course ${courseId} reactivated`);
      return true;
    } else {
      console.log(`Cannot reactivate course ${courseId} - end date has passed`);
      return false;
    }
    
  } catch (error) {
    console.error(`Error reactivating course ${courseId}:`, error);
    throw error;
  }
};
