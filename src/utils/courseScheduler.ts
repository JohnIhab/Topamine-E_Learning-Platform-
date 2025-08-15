import { checkAndUpdateExpiredCourses } from './courseStatusManager';


class CourseExpirationScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60 * 60 * 1000;
  private isRunning = false;


  start(customInterval?: number): void {
    if (this.isRunning) {
      console.log('Course expiration scheduler is already running');
      return;
    }

    const interval = customInterval || this.CHECK_INTERVAL;
    
    console.log(`Starting course expiration scheduler (checking every ${interval / 1000 / 60} minutes)`);
    
    this.runCheck();
    
    this.intervalId = setInterval(() => {
      this.runCheck();
    }, interval);
    
    this.isRunning = true;
  }


  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Course expiration scheduler stopped');
    }
  }


  getStatus(): boolean {
    return this.isRunning;
  }

  async runCheck(): Promise<void> {
    try {
      console.log('Running scheduled course expiration check...');
      await checkAndUpdateExpiredCourses();
    } catch (error) {
      console.error('Error in scheduled course expiration check:', error);
    }
  }


  static initializeScheduler(): CourseExpirationScheduler {
    const scheduler = new CourseExpirationScheduler();
    
    scheduler.start();
    
    window.addEventListener('focus', () => {
      scheduler.runCheck();
    });
    
    window.addEventListener('beforeunload', () => {
      scheduler.stop();
    });
    
    return scheduler;
  }
}

export const courseScheduler = new CourseExpirationScheduler();

export const initializeCourseScheduler = () => CourseExpirationScheduler.initializeScheduler();

export default CourseExpirationScheduler;
