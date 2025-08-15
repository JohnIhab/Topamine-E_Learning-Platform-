# Course Status Management System

This feature implements automatic course status management with enrollment handling for the educational platform.

## Features

### 1. Automatic Course Status Updates
- Courses automatically change from "active" to "non-active" when their end date is reached
- Automatic cleanup runs every hour (configurable)
- Manual checks can be triggered

### 2. Enrollment Management
- When a course expires, all student enrollments are automatically removed
- Students receive notifications about course expiration
- Expired courses no longer appear in student course lists

### 3. Teacher Course Management
- Teachers can view course status in their course cards
- Manual course expiration option available
- Course reactivation (if end date hasn't passed)
- Expired courses remain visible to teachers with status indicator

### 4. Status Indicators
- Visual indicators on course cards show course status
- Different styling for active vs expired courses
- Status chips and badges for clear identification

## Implementation Files

### Core Utilities
- `src/utils/courseStatusManager.ts` - Core course status management functions
- `src/utils/courseScheduler.ts` - Automatic scheduling service
- `src/utils/courseTestUtils.ts` - Testing utilities

### Components
- `src/components/CourseStatusManager/CourseStatusManager.tsx` - Teacher course management UI
- `src/components/CourseCard/Card1.tsx` - Updated with status indicators
- `src/components/AddNewCourse/NewCourse.tsx` - Updated to set initial status

### Pages
- `src/pages/ProfileStudent/ProfileStudent.tsx` - Filters out expired courses
- `src/App.tsx` - Initializes the course scheduler

## API Functions

### Core Functions

#### `checkAndUpdateExpiredCourses()`
Checks all active courses and updates expired ones to non-active status.

#### `expireCourseManually(courseId: string)`
Manually expires a specific course and removes enrollments.

#### `reactivateCourse(courseId: string)`
Reactivates a course if the end date hasn't passed.

#### `getActiveCoursesEnrollmentCount(teacherId: string)`
Gets enrollment counts for a teacher's active courses only.

### Scheduler Functions

#### `courseScheduler.start(interval?: number)`
Starts the automatic course expiration checker.

#### `courseScheduler.stop()`
Stops the automatic checker.

#### `courseScheduler.runCheck()`
Manually triggers an expiration check.

## Usage

### Automatic Setup
The system automatically initializes when the app starts:

```typescript
// In App.tsx
useEffect(() => {
  const scheduler = initializeCourseScheduler();
  return () => scheduler.stop();
}, []);
```

### Manual Testing
Testing utilities are available in the browser console:

```javascript
// Check for expired courses
window.courseTests.testCourseExpirationCheck();

// Test scheduler (5-minute intervals)
window.courseTests.testScheduler();

// Get enrollment counts for a teacher
window.courseTests.testGetEnrollmentCounts('teacherId');

// Manually expire a course (use with caution!)
window.courseTests.testExpireCourse('courseId');

// Reactivate a course
window.courseTests.testReactivateCourse('courseId');

// Run all tests
window.courseTests.runAllTests('teacherId', 'courseId');
```

### Using the Course Status Manager Component

```tsx
import CourseStatusManager from '../CourseStatusManager/CourseStatusManager';

<CourseStatusManager
  courseId={course.id}
  courseTitle={course.title}
  currentStatus={course.status}
  endDate={course.endDate}
  onStatusChanged={() => {
    // Refresh course data
    fetchCourses();
  }}
/>
```

## Database Schema Changes

### Courses Collection
Added fields:
- `status: string` - "active" or "non-active"
- `expiredAt?: Date` - Timestamp when course was expired
- `manuallyExpired?: boolean` - Flag for manually expired courses
- `reactivatedAt?: Date` - Timestamp of last reactivation

### Notifications Collection (per user)
New notification types:
- `type: 'course_expired'` - When a course expires
- Course-specific notifications with `courseId` reference

## Configuration

### Scheduler Intervals
Default: 1 hour (3,600,000 ms)
Configurable in `courseScheduler.ts`:

```typescript
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
```

### Manual Override
Teachers can manually expire or reactivate courses through the UI, with appropriate safeguards and confirmations.

## Error Handling

- All operations include try-catch blocks with logging
- Failed operations don't crash the application
- User feedback through toast notifications
- Console logging for debugging

## Security Considerations

- Only teachers can manage their own courses
- Students cannot see expired courses in their lists
- Manual operations require confirmation dialogs
- Enrollment removal includes proper cleanup

## Future Enhancements

- Email notifications for course expiration
- Bulk course management
- Advanced scheduling options
- Course archiving vs deletion
- Student notification preferences
- Analytics on course completion rates
