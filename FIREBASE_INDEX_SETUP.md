# Firebase Firestore Index Setup

## Teacher Course Filtering Index

### Issue
The application now filters courses by teacher ID, which requires a composite index in Firebase Firestore when combined with ordering.

### Current Solution
We've implemented a temporary fix by removing the `orderBy` clause from the Firestore query and sorting the results in memory. This works for development but may not be optimal for production with large datasets.

### Production Setup (Recommended)

For production, you should create the proper composite index in Firebase Console:

1. **Automatic Index Creation**:
   - When you run the application and the error occurs, Firebase provides a direct link to create the index
   - Click on the link in the console error to automatically create the index

2. **Manual Index Creation**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to Firestore Database
   - Click on "Indexes" tab
   - Click "Create Index"
   - Set up the composite index with these fields:
     - Collection: `courses`
     - Fields:
       - `teacherId` (Ascending)
       - `createdAt` (Descending)

3. **Index Configuration**:
   ```
   Collection: courses
   Fields:
   - teacherId: Ascending
   - createdAt: Descending
   ```

### Benefits of Proper Index
- Better performance for large datasets
- Server-side sorting reduces bandwidth
- Improved scalability
- Real-time updates work more efficiently

### Current Query Structure
```typescript
// Current (temporary fix)
const coursesQuery = query(
  collection(db, 'courses'),
  where('teacherId', '==', user.uid)
  // orderBy removed, sorting done in memory
);

// Production (with index)
const coursesQuery = query(
  collection(db, 'courses'),
  where('teacherId', '==', user.uid),
  orderBy('createdAt', 'desc')
);
```

### Note
Once you create the index in Firebase Console, you can restore the `orderBy` clause in the query for better performance.
