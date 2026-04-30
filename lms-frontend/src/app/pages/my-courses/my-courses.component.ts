import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-courses-page">
      <div class="container">
        <div class="page-header">
          <h1>My Courses</h1>
          <p>Continue where you left off</p>
        </div>

        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (courses.length === 0) {
          <div class="empty-state">
            <i class="fas fa-graduation-cap"></i>
            <h3>No courses yet</h3>
            <p>Start learning by enrolling in a course</p>
            <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
          </div>
        } @else {
          <div class="courses-list">
            @for (course of courses; track course.id) {
              <div class="course-row">
                <div class="course-thumbnail">
                  <img [src]="course.thumbnail || 'https://via.placeholder.com/200x120'" [alt]="course.title">
                </div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p class="course-instructor">
                    <i class="fas fa-user"></i> 
                    {{ course.instructor?.firstName }} {{ course.instructor?.lastName }}
                  </p>
                  <div class="course-progress">
                    <div class="progress-bar">
                      <div class="progress" [style.width.%]="getProgress(course.id)"></div>
                    </div>
                    <span class="progress-text">{{ getProgress(course.id) }}% complete</span>
                  </div>
                </div>
                <div class="course-actions">
                  <a [routerLink]="['/learn', course.id]" class="btn btn-primary">
                    <i class="fas fa-play"></i> Continue
                  </a>
                  <a [routerLink]="['/courses', course.id]" class="btn btn-outline">View Details</a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .my-courses-page {
      padding: 40px 0;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #6b7280;
    }

    .courses-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .course-row {
      display: flex;
      gap: 24px;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: box-shadow 0.3s;
    }

    .course-row:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .course-thumbnail {
      width: 200px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .course-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .course-info h3 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .course-instructor {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .course-instructor i {
      color: #f59e0b;
      margin-right: 4px;
    }

    .course-progress {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      max-width: 300px;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      border-radius: 4px;
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 14px;
      color: #6b7280;
      white-space: nowrap;
    }

    .course-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
    }

    .btn {
      padding: 10px 20px;
      font-size: 14px;
      white-space: nowrap;
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
      padding: 64px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .empty-state i {
      font-size: 64px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 24px;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    @media (max-width: 768px) {
      .course-row {
        flex-direction: column;
      }
      .course-thumbnail {
        width: 100%;
        height: 180px;
      }
      .course-actions {
        flex-direction: row;
      }
    }
  `]
})
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  progressMap: Map<number, number> = new Map();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        // Generate mock progress for each course
        courses.forEach(course => {
          this.progressMap.set(course.id, Math.floor(Math.random() * 80) + 10);
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getProgress(courseId: number): number {
    return this.progressMap.get(courseId) || 0;
  }
}