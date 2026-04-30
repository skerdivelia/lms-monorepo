import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="dashboard-header">
          <h1>Welcome back, {{ user?.firstName }}!</h1>
          <p>Continue your learning journey</p>
        </div>

        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else {
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ enrolledCourses.length }}</span>
                <span class="stat-label">Enrolled Courses</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ completedLessons }}</span>
                <span class="stat-label">Completed Lessons</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ totalHours }}</span>
                <span class="stat-label">Learning Hours</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-certificate"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ certificates }}</span>
                <span class="stat-label">Certificates</span>
              </div>
            </div>
          </div>

          <div class="dashboard-content">
            <section class="section">
              <div class="section-header">
                <h2>Continue Learning</h2>
                <a routerLink="/my-courses" class="view-all">View All</a>
              </div>
              
              @if (enrolledCourses.length === 0) {
                <div class="empty-state">
                  <i class="fas fa-graduation-cap"></i>
                  <h3>No courses yet</h3>
                  <p>Start learning by enrolling in a course</p>
                  <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
                </div>
              } @else {
                <div class="courses-grid">
                  @for (course of enrolledCourses.slice(0, 3); track course.id) {
                    <div class="course-card">
                      <div class="course-thumbnail">
                        <img [src]="course.thumbnail || 'https://via.placeholder.com/300x200'" [alt]="course.title">
                        <div class="progress-overlay">
                          <div class="progress-bar">
                            <div class="progress" [style.width.%]="getProgress(course)"></div>
                          </div>
                          <span>{{ getProgress(course) }}% complete</span>
                        </div>
                      </div>
                      <div class="course-content">
                        <h3>{{ course.title }}</h3>
                        <p class="course-instructor">{{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</p>
                        <a [routerLink]="['/learn', course.id]" class="btn btn-primary btn-sm">Continue</a>
                      </div>
                    </div>
                  }
                </div>
              }
            </section>

            @if (isInstructor) {
              <section class="section">
                <div class="section-header">
                  <h2>Your Courses</h2>
                  <a routerLink="/instructor/courses" class="view-all">Manage</a>
                </div>
                
                @if (myCourses.length === 0) {
                  <div class="empty-state">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <h3>No courses created</h3>
                    <p>Share your knowledge by creating a course</p>
                    <a routerLink="/instructor/courses/create" class="btn btn-primary">Create Course</a>
                  </div>
                } @else {
                  <div class="courses-grid">
                    @for (course of myCourses.slice(0, 3); track course.id) {
                      <div class="course-card">
                        <div class="course-thumbnail">
                          <img [src]="course.thumbnail || 'https://via.placeholder.com/300x200'" [alt]="course.title">
                        </div>
                        <div class="course-content">
                          <h3>{{ course.title }}</h3>
                          <div class="course-stats">
                            <span><i class="fas fa-users"></i> {{ course.totalStudents }} students</span>
                            <span><i class="fas fa-star"></i> {{ course.rating?.toFixed(1) || '0.0' }}</span>
                          </div>
                          <a [routerLink]="['/instructor/courses', course.id, 'edit']" class="btn btn-outline btn-sm">Edit</a>
                        </div>
                      </div>
                    }
                  </div>
                }
              </section>
            }

            <section class="section">
              <div class="section-header">
                <h2>Recommended For You</h2>
              </div>
              
              @if (recommendedCourses.length === 0) {
                <div class="empty-state">
                  <i class="fas fa-lightbulb"></i>
                  <h3>No recommendations yet</h3>
                  <p>Enroll in courses to get personalized recommendations</p>
                </div>
              } @else {
                <div class="courses-grid">
                  @for (course of recommendedCourses.slice(0, 3); track course.id) {
                    <div class="course-card">
                      <div class="course-thumbnail">
                        <img [src]="course.thumbnail || 'https://via.placeholder.com/300x200'" [alt]="course.title">
                      </div>
                      <div class="course-content">
                        <h3>{{ course.title }}</h3>
                        <p class="course-price">\${{ course.price }}</p>
                        <a [routerLink]="['/courses', course.id]" class="btn btn-outline btn-sm">View</a>
                      </div>
                    </div>
                  }
                </div>
              }
            </section>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 40px 0;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .dashboard-header p {
      color: #6b7280;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: #eef2ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon i {
      font-size: 24px;
      color: #4f46e5;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
    }

    .stat-label {
      color: #6b7280;
      font-size: 14px;
    }

    .section {
      margin-bottom: 48px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
    }

    .view-all {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .course-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .course-thumbnail {
      position: relative;
      height: 160px;
      overflow: hidden;
    }

    .course-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .progress-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 24px 16px 16px;
      color: white;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: #10b981;
      border-radius: 2px;
    }

    .progress-overlay span {
      font-size: 12px;
    }

    .course-content {
      padding: 20px;
    }

    .course-content h3 {
      font-size: 16px;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-instructor,
    .course-stats {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .course-stats {
      display: flex;
      gap: 16px;
    }

    .course-stats i {
      color: #f59e0b;
      margin-right: 4px;
    }

    .course-price {
      font-size: 18px;
      font-weight: 700;
      color: #4f46e5;
      margin-bottom: 12px;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #e5e7eb;
      color: #374151;
    }

    .btn-outline:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .empty-state i {
      font-size: 48px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 16px;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .courses-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  enrolledCourses: Course[] = [];
  myCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  loading = true;
  isInstructor = false;
  completedLessons = 0;
  totalHours = 0;
  certificates = 0;

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.isInstructor = this.user?.role === 'INSTRUCTOR' || this.user?.role === 'ADMIN';

    // Load enrolled courses
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.calculateStats();
      }
    });

    // Load instructor's courses
    if (this.isInstructor) {
      this.courseService.getInstructorCourses().subscribe({
        next: (courses) => {
          this.myCourses = courses;
        }
      });
    }

    // Load recommended courses
    this.courseService.getPublicCourses(0, 4).subscribe({
      next: (response) => {
        this.recommendedCourses = response.content.filter(
          c => !this.enrolledCourses.some(e => e.id === c.id)
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    // Calculate completed lessons (mock data for now)
    this.completedLessons = this.enrolledCourses.length * 3;
    this.totalHours = Math.round(this.enrolledCourses.reduce((acc, c) => acc + (c.duration || 0), 0) * 0.3);
    this.certificates = Math.floor(this.enrolledCourses.length / 2);
  }

  getProgress(course: Course): number {
    // Mock progress - in real app, this would come from enrollment data
    return Math.floor(Math.random() * 80) + 10;
  }
}