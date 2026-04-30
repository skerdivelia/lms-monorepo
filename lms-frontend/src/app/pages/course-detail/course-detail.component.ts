import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course, Lesson } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    @if (loading) {
      <div class="loading">
        <div class="spinner"></div>
      </div>
    } @else if (course) {
      <div class="course-detail">
        <div class="course-hero">
          <div class="container">
            <div class="hero-content">
              <div class="breadcrumb">
                <a routerLink="/">Home</a>
                <span>/</span>
                <a routerLink="/courses">Courses</a>
                <span>/</span>
                <span>{{ course.title }}</span>
              </div>
              <h1>{{ course.title }}</h1>
              <p class="course-description">{{ course.shortDescription }}</p>
              <div class="course-meta">
                <span><i class="fas fa-user"></i> {{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</span>
                <span><i class="fas fa-star"></i> {{ course.rating?.toFixed(1) || '0.0' }} ({{ course.totalReviews }} reviews)</span>
                <span><i class="fas fa-users"></i> {{ course.totalStudents }} students</span>
                <span><i class="fas fa-clock"></i> {{ course.duration }} hours</span>
              </div>
              <div class="course-price">
                @if (course.discountPrice && course.discountPrice < course.price) {
                  <span class="original-price">\${{ course.price }}</span>
                  <span class="discount-price">\${{ course.discountPrice }}</span>
                } @else {
                  <span>\${{ course.price }}</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="course-content">
          <div class="container">
            <div class="content-grid">
              <div class="main-content">
                <section class="section">
                  <h2>About this course</h2>
                  <p>{{ course.description }}</p>
                </section>

                <section class="section">
                  <h2>What you'll learn</h2>
                  <ul class="learning-points">
                    @for (point of course.learningPoints; track point) {
                      <li><i class="fas fa-check"></i> {{ point }}</li>
                    }
                  </ul>
                </section>

                <section class="section">
                  <h2>Course Content</h2>
                  <div class="curriculum">
                    @for (lesson of course.lessons; track lesson.id; let i = $index) {
                      <div class="lesson-item" [class.expanded]="expandedLessons.has(lesson.id)" (click)="toggleLesson(lesson.id)">
                        <div class="lesson-header">
                          <i class="fas" [class.fa-chevron-down]="!expandedLessons.has(lesson.id)" [class.fa-chevron-up]="expandedLessons.has(lesson.id)"></i>
                          <span class="lesson-number">{{ i + 1 }}</span>
                          <span class="lesson-title">{{ lesson.title }}</span>
                          <span class="lesson-duration">{{ lesson.duration }} min</span>
                        </div>
                        @if (expandedLessons.has(lesson.id)) {
                          <div class="lesson-content">
                            <p>{{ lesson.content }}</p>
                            @if (lesson.videoUrl) {
                              <div class="video-container">
                                <video [src]="lesson.videoUrl" controls></video>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </section>

                <section class="section">
                  <h2>Instructor</h2>
                  <div class="instructor-card">
                    <div class="instructor-avatar">
                      <img [src]="course.instructor?.avatar || 'https://via.placeholder.com/100'" [alt]="course.instructor?.firstName">
                    </div>
                    <div class="instructor-info">
                      <h3>{{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</h3>
                      <p class="instructor-title">{{ course.instructor?.title || 'Instructor' }}</p>
                      <p class="instructor-bio">{{ course.instructor?.bio || 'Experienced instructor' }}</p>
                    </div>
                  </div>
                </section>

                <section class="section">
                  <h2>Reviews</h2>
                  <div class="reviews-summary">
                    <div class="rating-overview">
                      <span class="big-rating">{{ course.rating?.toFixed(1) || '0.0' }}</span>
                      <div class="stars">
                        @for (star of [1,2,3,4,5]; track star) {
                          <i class="fas fa-star" [class.filled]="star <= (course.rating || 0)"></i>
                        }
                      </div>
                      <span>{{ course.totalReviews }} reviews</span>
                    </div>
                  </div>
                </section>
              </div>

              <div class="sidebar">
                <div class="enrollment-card">
                  <div class="card-image">
                    <img [src]="course.thumbnail || 'https://via.placeholder.com/400x225'" [alt]="course.title">
                  </div>
                  <div class="card-content">
                    @if (isEnrolled) {
                      <button class="btn btn-primary btn-block" (click)="startLearning()">
                        <i class="fas fa-play"></i> Continue Learning
                      </button>
                    } @else {
                      <button class="btn btn-primary btn-block" (click)="enroll()">
                        <i class="fas fa-shopping-cart"></i> Enroll Now
                      </button>
                    }
                    <ul class="course-features">
                      <li><i class="fas fa-infinity"></i> Full lifetime access</li>
                      <li><i class="fas fa-mobile-alt"></i> Access on mobile and TV</li>
                      <li><i class="fas fa-certificate"></i> Certificate of completion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <h2>Course not found</h2>
        <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
      </div>
    }
  `,
  styles: [`
    .course-detail {
      min-height: 100vh;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .course-hero {
      background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%);
      color: white;
      padding: 60px 0;
    }

    .breadcrumb {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .breadcrumb a {
      color: #a5b4fc;
      text-decoration: none;
    }

    .breadcrumb span {
      color: #a5b4fc;
    }

    .hero-content h1 {
      font-size: 36px;
      margin-bottom: 16px;
    }

    .course-description {
      font-size: 18px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .course-meta {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .course-meta i {
      color: #fbbf24;
      margin-right: 4px;
    }

    .course-price {
      font-size: 32px;
      font-weight: 700;
    }

    .original-price {
      text-decoration: line-through;
      opacity: 0.7;
      font-size: 24px;
      margin-right: 12px;
    }

    .discount-price {
      color: #10b981;
    }

    .course-content {
      padding: 48px 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 48px;
    }

    .section {
      margin-bottom: 48px;
    }

    .section h2 {
      font-size: 24px;
      margin-bottom: 24px;
    }

    .learning-points {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      list-style: none;
      padding: 0;
    }

    .learning-points li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .learning-points i {
      color: #10b981;
      margin-top: 4px;
    }

    .curriculum {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .lesson-item {
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
    }

    .lesson-item:last-child {
      border-bottom: none;
    }

    .lesson-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f9fafb;
    }

    .lesson-number {
      background: #e5e7eb;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .lesson-title {
      flex: 1;
      font-weight: 500;
    }

    .lesson-duration {
      color: #6b7280;
      font-size: 14px;
    }

    .lesson-content {
      padding: 16px;
      background: white;
    }

    .video-container {
      margin-top: 16px;
    }

    .video-container video {
      width: 100%;
      border-radius: 8px;
    }

    .instructor-card {
      display: flex;
      gap: 24px;
      padding: 24px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .instructor-avatar img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .instructor-info h3 {
      margin-bottom: 4px;
    }

    .instructor-title {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .reviews-summary {
      padding: 24px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .rating-overview {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .big-rating {
      font-size: 48px;
      font-weight: 700;
      color: #4f46e5;
    }

    .stars {
      display: flex;
      gap: 4px;
    }

    .stars i {
      color: #d1d5db;
    }

    .stars i.filled {
      color: #fbbf24;
    }

    .enrollment-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      position: sticky;
      top: 24px;
    }

    .card-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .card-content {
      padding: 24px;
    }

    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      margin-bottom: 24px;
    }

    .course-features {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .course-features li {
      display: flex;
      gap: 12px;
      padding: 8px 0;
      color: #6b7280;
    }

    .course-features i {
      color: #4f46e5;
    }

    .not-found {
      text-align: center;
      padding: 64px;
    }

    .not-found h2 {
      margin-bottom: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      .sidebar {
        order: -1;
      }
      .enrollment-card {
        position: static;
      }
    }

    @media (max-width: 576px) {
      .learning-points {
        grid-template-columns: 1fr;
      }
      .course-meta {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  isEnrolled = false;
  expandedLessons = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(+courseId);
      this.checkEnrollment(+courseId);
    }
  }

  loadCourse(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  checkEnrollment(courseId: number): void {
    if (this.authService.isLoggedIn()) {
      this.courseService.checkEnrollment(courseId).subscribe({
        next: (enrolled) => {
          this.isEnrolled = enrolled;
        }
      });
    }
  }

  toggleLesson(lessonId: number): void {
    if (this.expandedLessons.has(lessonId)) {
      this.expandedLessons.delete(lessonId);
    } else {
      this.expandedLessons.add(lessonId);
    }
  }

  enroll(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.course) {
      // Navigate to checkout
      this.router.navigate(['/checkout', this.course.id]);
    }
  }

  startLearning(): void {
    if (this.course) {
      this.router.navigate(['/learn', this.course.id]);
    }
  }
}