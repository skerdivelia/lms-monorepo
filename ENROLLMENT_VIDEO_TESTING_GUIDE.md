# Enrollment & Video Testing Guide

## Overview
This document outlines the complete enrollment and video watching flow, including embedded YouTube video support, seed data, and API integration.

## What Was Done

### Backend Enhancements

#### 1. **Course Entity & DTO Updates**
- Added `learningPoints` field to `Course` entity (stored in `course_learning_points` table via `@ElementCollection`)
- Updated `CourseResponse.LessonResponse` to include full video/content details
- Enhanced `CourseResponse.UserSummary` to include instructor `title` and `bio`
- `mapToResponse` in `CourseServiceImpl` now includes lessons and totalReviews count

#### 2. **Enrollment Controller API Wiring**
- Existing `/api/enrollments/course/{courseId}` endpoint accepts `paymentId` and `amount`
- New `/api/enrollments/my-courses` endpoint returns enrolled courses with full `CourseResponse` objects
- Existing `/api/enrollments/check/{courseId}` checks if student is enrolled

#### 3. **Seed Data (DataInitializer.java)**
- Initializes 6 courses across 5 categories with realistic metadata:
  - **Java 17 & Spring Boot 3**: with JWT, REST, Testing lessons
  - **Angular + Spring Boot Full Stack**: client-server integration lessons
  - **Python Data Science**: NumPy, pandas, visualization lessons
  - **Docker & Kubernetes**: containerization and orchestration lessons
  - **AI Prompt Engineering**: ChatGPT API, prompt design lessons
  - **Mobile Flutter**: cross-platform app development lessons
- Each lesson includes YouTube URLs that will embed in the UI
- Each course has 5 learning points displayed on course detail

#### 4. **Test Accounts**
- `admin@codecamp.test` / `Admin123!` (ADMIN role)
- `instructor@codecamp.test` / `Instructor123!` (INSTRUCTOR role)
- `student@codecamp.test` / `Student123!` (STUDENT role)

### Frontend Enhancements

#### 1. **Course Detail Component**
- Integrated YouTube video embedding:
  - Detects YouTube URLs automatically
  - Converts to embeddable iframe URLs
  - Falls back to `<video>` tag for other URLs
- Shows `course.learningPoints` array with checkmarks
- Displays lesson expandable list with videos inline
- "Enroll Now" button navigates to checkout
- "Continue Learning" button navigates to `/learn/:id` (course detail page)

#### 2. **Checkout Component**
- Calls `CourseService.createPaymentIntent()` to get payment intent
- Passes `paymentId` and `amount` to enrollment API
- On success, navigates to `/my-courses`

#### 3. **Course Service**
- `checkEnrollment(courseId)` returns boolean after extracting from API response
- `enrollInCourse(courseId, paymentId, amount)` posts to correct endpoint
- `getEnrolledCourses()` returns `CourseResponse[]` from `/api/enrollments/my-courses`

#### 4. **My Courses Page**
- Lists all enrolled courses with progress bars
- "Continue" button navigates to `/learn/:courseId` (course detail)
- Shows course thumbnail, instructor, and progress

#### 5. **Routes**
- Added `/learn/:id` route that loads `CourseDetailComponent`
- This allows course detail page to be reused for both browsing and learning

## Manual Testing Flow

### Prerequisites
1. Backend running on `http://localhost:8080`
2. Frontend running on `http://localhost:4200`
3. Database initialized with seed data (runs automatically on app startup)

### Test Scenario: Student Enrollment & Video Watching

#### Step 1: Login as Student
1. Navigate to `http://localhost:4200/login`
2. Login with: `student@codecamp.test` / `Student123!`
3. Should redirect to home or dashboard

#### Step 2: Browse Courses
1. Go to `/courses` or `/`
2. Click "Browse Courses" or navigate to `/courses`
3. Should see 6 courses with thumbnails, prices, instructor names

#### Step 3: View Course Detail
1. Click any course card (e.g., "Java 17 & Spring Boot 3 CodeCamp")
2. Should see:
   - Course hero with title, description, price
   - "What you'll learn" section with 5 learning points
   - "Course Content" section with 5 expandable lessons
   - Instructor card with bio
   - "Enroll Now" button (because not enrolled yet)

#### Step 4: Enroll in Course
1. Click "Enroll Now" button
2. Should navigate to `/checkout/{courseId}`
3. Fill in checkout form:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - Name: Test User
   - Address: 123 Main St
   - City: New York
   - ZIP: 10001
4. Click "Pay $29.99" (or appropriate discount price)
5. After 1.5 second delay (payment simulation), should navigate to `/my-courses`

#### Step 5: View Enrolled Courses
1. On `/my-courses` page, should see the enrolled course
2. Shows: thumbnail, title, instructor, progress bar, "Continue" button

#### Step 6: Start Learning
1. Click "Continue" button on the enrolled course card
2. Should navigate to `/learn/{courseId}` (course detail)
3. "Enroll Now" button should now say "Continue Learning" (enrolled check passed)

#### Step 7: Watch Video Lesson
1. Expand lesson #1 "Spring Boot 3 Introduction"
2. Should see lesson description + embedded YouTube video iframe
3. Click play on video, should show YouTube player
4. Verify video loads and can be played

#### Step 8: View Other Lessons
1. Collapse lesson #1
2. Expand lesson #2 "Java 17 Records & Text Blocks"
3. Should see different YouTube video embedded
4. Repeat for other lessons to confirm all videos load

### Test Scenario: Enrollment Check
1. Login as student (if not already)
2. Go to `/courses/{courseId}` of an enrolled course
3. "Enroll Now" button should now say "Continue Learning"
4. This confirms `/api/enrollments/check/{courseId}` works

### Test Scenario: My Learning Page
1. Enroll in 2-3 different courses (repeat steps 3-5 above)
2. Go to `/my-courses`
3. Should see all enrolled courses listed
4. Each should show random progress 10-90%
5. Click "Continue" on any course to jump to lesson viewing

## API Endpoints Summary

### For Frontend
- `GET /api/courses` - Browse all courses (paginated)
- `GET /api/courses/{courseId}` - Get course detail with lessons
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/enrollments/course/{courseId}` - Enroll with paymentId/amount
- `GET /api/enrollments/check/{courseId}` - Check if enrolled
- `GET /api/enrollments/my-courses` - Get all enrolled courses
- `POST /api/auth/login` - JWT login
- `POST /api/auth/register` - Student registration

### For Admin (Dashboard)
- `GET /api/admin/users` - List all users and instructors
- `PATCH /api/admin/users/{userId}/block` - Block a user or instructor account
- `PATCH /api/admin/users/{userId}/unblock` - Unblock a user or instructor account
- `DELETE /api/admin/users/{userId}` - Delete a user and their enrollments
- `GET /api/admin/payments` - View all payment/enrollment records
- `POST /api/courses/{courseId}/approve` - Admin approves courses
- `GET /api/enrollments/course/{courseId}` - Instructor views course enrollments

## Manual Testing Flow: Admin Dashboard

### Test Scenario: Admin User Management
1. Login as admin at `http://localhost:4200/login` with `admin@codecamp.test` / `Admin123!`
2. Navigate to `/admin` or click the Admin Control Center from the homepage.
3. Verify the Users & Instructors tab loads a table of accounts with roles and status.
4. Click `Block` on a student or instructor account and confirm the button updates to `Unblock`.
5. Click `Unblock` to restore access.
6. Click `Delete` on a test user and verify the user is removed from the list.

### Test Scenario: Admin Payment Tracking
1. In the Admin Dashboard, select the Payments tab.
2. Confirm the payments table shows student name, course title, amount, payment ID, and enrollment date.
3. Verify the payment records match enrollments made by student accounts.

## Known Limitations

1. **Payment**: Demo uses simulated payment (generates fake paymentId). In production, integrate Stripe.js
2. **Progress Tracking**: Frontend shows random progress; backend tracks via `PUT /api/enrollments/{enrollmentId}/progress`
3. **Video Hosting**: All videos point to real YouTube URLs; ensure links are public and not region-blocked
4. **Session Duration**: JWT tokens expire per your `application.yml` config; adjust if needed

## Troubleshooting

### Enrollment fails with 401
- Check JWT token is sent in `Authorization: Bearer {token}` header
- Verify user logged in and has STUDENT role

### Courses not loading
- Verify seed data ran (check database for courses table)
- Check backend logs for DataInitializer errors

### Videos not embedding
- Verify YouTube URL format matches patterns in `isYouTubeUrl()` method
- Check browser console for CSP (Content Security Policy) errors
- Ensure video IDs are extracted correctly (11 alphanumeric characters)

### /my-courses returns empty
- Verify student is enrolled in at least one course
- Check `/api/enrollments/my-courses` returns data via curl/Postman

## Next Steps

1. **Progress Tracking**: Add UI for marking lessons complete and tracking progress
2. **Quiz/Assignments**: Add Quiz and Assignment lesson types with scoring
3. **Certificates**: Generate certificates on 100% course completion
4. **Real Payments**: Integrate Stripe.js for actual payment processing
5. **Video Upload**: Replace YouTube URLs with custom video storage
6. **Reviews & Ratings**: Add student reviews and course ratings
