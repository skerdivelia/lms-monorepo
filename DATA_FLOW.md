# Complete Data Flow: Enrollment & Video Watching

## Architecture Overview

```
Frontend (Angular)          Backend (Spring Boot)           Database
===============             ===================              ========

    [Home]
      ↓
  [Courses List] ←→ GET /api/courses (paginated)
      ↓
[Course Detail] ←→ GET /api/courses/{id}
      ├─ Display learningPoints[]
      ├─ Expand lessons
      └─ Embed YouTube videos
      ↓
[Enroll Now Button]
      ↓
[Checkout Page]
      ├─ Call POST /api/payments/create-intent
      ├─ Simulate payment (or Stripe.js)
      └─ Call POST /api/enrollments/course/{courseId}
          └─ with {paymentId, amount}
              ↓
          [EnrollmentServiceImpl.enrollInCourse]
              ├─ Check if already enrolled (exists)
              ├─ Create Enrollment entity
              ├─ Save to DB
              └─ Increment course.totalStudents++
      ↓
[My Courses Page] ←→ GET /api/enrollments/my-courses
      ├─ Lists all CourseResponse objects
      └─ Shows progress bars for each
      ↓
[Continue Learning]
      ↓
[Course Detail (Learning Mode)]
      ├─ Check: GET /api/enrollments/check/{courseId}
      ├─ Return: {enrolled: true}
      ├─ Button changes: "Enroll Now" → "Continue Learning"
      ├─ Expand lessons with videos
      └─ YouTube iframes embedded inline
```

## Data Models

### Course Entity Flow
```
Course (from DB)
├─ id: Long
├─ title: String
├─ description: String
├─ thumbnail: String
├─ shortDescription: String
├─ price: BigDecimal
├─ discountPrice: BigDecimal
├─ level: CourseLevel (BEGINNER|INTERMEDIATE|ADVANCED)
├─ duration: int (hours)
├─ published: boolean
├─ approved: boolean
├─ requirements: String
├─ outcomes: String
├─ learningPoints: List<String>  ← NEW: From course_learning_points table
├─ instructor: User (FK)
├─ category: Category (FK)
├─ lessons: List<Lesson>         ← NEW: Full lessons in response
├─ enrollments: List<Enrollment> (FK)
├─ reviews: List<Review> (FK)
├─ rating: double
├─ totalStudents: int
├─ totalReviews: int             ← NEW: Computed from reviews.size()
└─ createdAt, updatedAt: LocalDateTime
```

### API Response: CourseResponse
```json
{
  "id": 1,
  "title": "Java 17 & Spring Boot 3 CodeCamp",
  "description": "...",
  "thumbnail": "https://img.youtube.com/vi/.../maxresdefault.jpg",
  "shortDescription": "Build a professional Java backend...",
  "price": 49.99,
  "discountPrice": 29.99,
  "level": "INTERMEDIATE",
  "duration": 12,
  "published": true,
  "approved": true,
  "requirements": "Basic Java knowledge",
  "outcomes": "Modern Spring Boot API development...",
  "learningPoints": [
    "Build production-grade Spring Boot REST APIs",
    "Secure endpoints with JWT authentication",
    "Use JPA and Hibernate for data persistence",
    "Structure real-world backend services",
    "Ship maintainable Java applications"
  ],
  "instructor": {
    "id": 2,
    "firstName": "CodeCamp",
    "lastName": "Instructor",
    "avatar": null,
    "title": "INSTRUCTOR",
    "bio": null
  },
  "category": {
    "id": 1,
    "name": "Web Development",
    "icon": "web-icon"
  },
  "lessons": [
    {
      "id": 1,
      "title": "Spring Boot 3 Introduction",
      "description": "Why Spring Boot 3 and Java 17 matter...",
      "type": "VIDEO",
      "videoUrl": "https://www.youtube.com/watch?v=9u8VITVKPzI",
      "content": "",
      "duration": 20,
      "orderIndex": 1,
      "free": true,
      "published": true
    },
    {
      "id": 2,
      "title": "Java 17 Records & Text Blocks",
      "description": "Use Java 17 language features...",
      "type": "VIDEO",
      "videoUrl": "https://www.youtube.com/watch?v=6nfj4XyVUw0",
      "content": "",
      "duration": 25,
      "orderIndex": 2,
      "free": false,
      "published": true
    }
    // ... more lessons
  ],
  "rating": 4.8,
  "totalReviews": 12,
  "totalStudents": 120,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-20T14:22:00"
}
```

### Enrollment Entity
```
Enrollment
├─ id: Long
├─ user: User (FK)         ← Student who enrolled
├─ course: Course (FK)     ← Course enrolled in
├─ paidAmount: double      ← What they paid
├─ paymentId: String       ← Stripe payment ID (demo: random)
├─ status: EnrollmentStatus (ACTIVE|COMPLETED|CANCELLED|REFUNDED)
├─ progress: int           ← 0-100%
├─ enrolledAt: LocalDateTime
├─ completedAt: LocalDateTime (null until 100% complete)
└─ createdAt: LocalDateTime (auto-set on insert)
```

## API Endpoint Sequence

### 1. Browse Courses
```
GET /api/courses?page=0&size=10&sortBy=createdAt&sortDir=desc

Response:
{
  "content": [
    { CourseResponse... },
    { CourseResponse... }
  ],
  "totalElements": 6,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### 2. View Course Detail (Browse Mode)
```
GET /api/courses/1

Response: CourseResponse (full object with learningPoints, lessons, etc.)
```

### 3. Check if Enrolled (Optional)
```
GET /api/enrollments/check/1
Header: Authorization: Bearer {JWT}

Response:
{
  "enrolled": false
}
```

### 4. Create Payment Intent
```
POST /api/payments/create-intent
Header: Authorization: Bearer {JWT}
Body: { "courseId": 1 }

Response:
{
  "clientSecret": "pi_1234567890_secret_abcdef..." 
  // In demo, any string works
}
```

### 5. Enroll Student
```
POST /api/enrollments/course/1
Header: Authorization: Bearer {JWT}
Body:
{
  "paymentId": "pi_1234567890_secret_abcdef",
  "amount": "29.99"
}

Response: 
{
  "id": 100,
  "user": { "id": 3, ... },
  "course": { "id": 1, ... },
  "paidAmount": 29.99,
  "paymentId": "pi_1234567890_secret_abcdef",
  "status": "ACTIVE",
  "progress": 0,
  "enrolledAt": "2024-01-22T10:30:00"
}
```

### 6. Get My Courses (After Enrollment)
```
GET /api/enrollments/my-courses
Header: Authorization: Bearer {JWT}

Response:
[
  { CourseResponse... },   ← Full course details
  { CourseResponse... }
]
```

### 7. View Course Detail (Learning Mode)
```
GET /api/courses/1
Header: Authorization: Bearer {JWT}

Response: CourseResponse (same structure, frontend checks enrollment status)
```

### 8. Update Progress (Optional)
```
PUT /api/enrollments/100/progress
Header: Authorization: Bearer {JWT}
Body: { "progress": 50 }

Response: 204 No Content
```

## Frontend Component Data Flow

### Course Detail Component
```typescript
ngOnInit() {
  // 1. Get course ID from route param
  courseId = this.route.snapshot.paramMap.get('id');
  
  // 2. Load course
  this.courseService.getCourseById(courseId).subscribe(course => {
    this.course = course;
    
    // course.learningPoints → display as checklist
    // course.lessons → display as expandable items
    // course.lessons[].videoUrl → embed as iframe if YouTube
  });
  
  // 3. Check enrollment (if logged in)
  this.courseService.checkEnrollment(courseId).subscribe(enrolled => {
    this.isEnrolled = enrolled;
    // Button shows "Continue Learning" if enrolled, else "Enroll Now"
  });
}

// Expand lesson
toggleLesson(lessonId) {
  if (expandedLessons.has(lessonId)) {
    expandedLessons.delete(lessonId);
  } else {
    expandedLessons.add(lessonId);
  }
}

// Embed YouTube
getEmbedUrl(videoUrl) {
  if (isYouTubeUrl(videoUrl)) {
    videoId = extractVideoId(videoUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return videoUrl; // Direct video
}

// Enroll
enroll() {
  this.router.navigate(['/checkout', this.course.id]);
}

// Continue learning (same component, just shows "Continue" button)
startLearning() {
  this.router.navigate(['/learn', this.course.id]);
}
```

### Checkout Component
```typescript
processPayment() {
  // 1. Create payment intent
  this.courseService.createPaymentIntent(this.course.id).subscribe(response => {
    paymentId = response.clientSecret; // or demo ID
    
    // 2. Simulate payment delay (real: use Stripe.js)
    setTimeout(() => {
      // 3. Enroll with payment details
      this.courseService.enrollInCourse(
        this.course.id,
        paymentId,
        this.finalPrice
      ).subscribe(() => {
        // 4. Success: navigate to my courses
        this.router.navigate(['/my-courses']);
      });
    }, 1500);
  });
}
```

### My Courses Component
```typescript
ngOnInit() {
  // Get all enrolled courses
  this.courseService.getEnrolledCourses().subscribe(courses => {
    this.courses = courses;
    
    // For each course, show:
    // - Thumbnail
    // - Title
    // - Instructor name
    // - Progress bar (currently mock)
    // - "Continue" button → navigate to /learn/{courseId}
  });
}

continue(courseId) {
  this.router.navigate(['/learn', courseId]);
}
```

## YouTube Video Detection & Embedding

### Supported URL Formats
```
https://www.youtube.com/watch?v=9u8VITVKPzI
https://youtu.be/9u8VITVKPzI
https://www.youtube.com/embed/9u8VITVKPzI
https://www.youtube.com/v/9u8VITVKPzI
https://www.youtube.com/shorts/9u8VITVKPzI
```

### Extraction Logic
```typescript
getYouTubeVideoId(url: string): string {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const result = regex.exec(url);
  return result ? result[1] : url;
}

getEmbedUrl(url: string): SafeResourceUrl {
  const videoId = getYouTubeVideoId(url);
  return this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${videoId}`
  );
}
```

### HTML Template
```html
@if (isYouTubeUrl(lesson.videoUrl)) {
  <div class="video-embed">
    <iframe [src]="getEmbedUrl(lesson.videoUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
    </iframe>
  </div>
} @else {
  <video [src]="lesson.videoUrl" controls></video>
}
```

## Database Schema (JPA Entities)

```
users
├─ id (PK)
├─ email (UNIQUE)
├─ password (hashed)
├─ firstName
├─ lastName
├─ phone
├─ avatar
├─ bio
├─ role (ENUM: STUDENT|INSTRUCTOR|ADMIN)
├─ enabled
├─ created_at
└─ updated_at

categories
├─ id (PK)
├─ name
├─ description
├─ icon
├─ created_at
└─ updated_at

courses
├─ id (PK)
├─ title
├─ description
├─ thumbnail
├─ short_description
├─ price
├─ discount_price
├─ level (ENUM)
├─ duration
├─ published
├─ approved
├─ requirements
├─ outcomes
├─ instructor_id (FK → users)
├─ category_id (FK → categories)
├─ rating
├─ total_students
├─ created_at
└─ updated_at

course_learning_points (ElementCollection)
├─ course_id (FK)
├─ learning_point (String)

lessons
├─ id (PK)
├─ course_id (FK)
├─ title
├─ description
├─ type (ENUM: VIDEO|ARTICLE|QUIZ|ASSIGNMENT)
├─ video_url
├─ content
├─ duration (minutes)
├─ order_index
├─ free
├─ published
├─ created_at
└─ updated_at

enrollments
├─ id (PK)
├─ user_id (FK)
├─ course_id (FK)
├─ paid_amount
├─ payment_id
├─ status (ENUM)
├─ progress (0-100%)
├─ enrolled_at
├─ completed_at
└─ created_at

reviews (optional)
├─ id (PK)
├─ course_id (FK)
├─ user_id (FK)
├─ rating (1-5)
├─ comment
├─ created_at
└─ updated_at
```

## Error Handling

### 401 Unauthorized
- User not logged in → frontend redirects to `/login`
- JWT expired → refresh token or re-login
- User is not STUDENT role → show error message

### 404 Not Found
- Course doesn't exist → show "Course not found" page
- Enrollment doesn't exist → show enrollment list

### 409 Conflict
- Already enrolled → show "Already enrolled" error
- Duplicate enrollment attempt → ignore or show message

### 400 Bad Request
- Invalid payment data → show validation errors
- Missing required fields → show form errors

---

**Diagram Format**: ASCII/Text  
**Last Updated**: Today  
**Scope**: Complete end-to-end flow for enrollment and video watching
