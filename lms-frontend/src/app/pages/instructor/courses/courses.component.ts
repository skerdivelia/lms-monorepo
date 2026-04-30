import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course.service';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="instructor-courses-page">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>My Courses</h1>
            <p>Manage your created courses</p>
          </div>
          <a routerLink="/instructor/courses/create" class="btn btn-primary">
            <i class="fas fa-plus"></i> Create Course
          </a>
        </div>

        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (courses.length === 0) {
          <div class="empty-state">
            <i class="fas fa-chalkboard-teacher"></i>
            <h3>No courses yet</h3>
            <p>Create your first course and start teaching</p>
            <a routerLink="/instructor/courses/create" class="btn btn-primary">Create Course</a>
          </div>
        } @else {
          <div class="courses-table">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (course of courses; track course.id) {
                  <tr>
                    <td>
                      <div class="course-cell">
                        <img [src]="course.thumbnail || 'https://via.placeholder.com/80x50'" [alt]="course.title">
                        <div class="course-info">
                          <h4>{{ course.title }}</h4>
                          <span>{{ course.totalLessons }} lessons</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ course.totalStudents }}</td>
                    <td>
                      <div class="rating">
                        <i class="fas fa-star"></i>
                        {{ course.rating?.toFixed(1) || '0.0' }}
                      </div>
                    </td>
                    <td>\${{ course.price }}</td>
                    <td>
                      <span class="badge" [class.badge-success]="course.isPublished" [class.badge-warning]="!course.isPublished">
                        {{ course.isPublished ? 'Published' : 'Draft' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <a [routerLink]="['/courses', course.id]" class="btn-icon" title="View">
                          <i class="fas fa-eye"></i>
                        </a>
                        <a [routerLink]="['/instructor/courses', course.id, 'edit']" class="btn-icon" title="Edit">
                          <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn-icon btn-danger" (click)="deleteCourse(course.id)" title="Delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .instructor-courses-page {
      padding: 40px 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #6b7280;
    }

    .courses-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 16px 20px;
      text-align: left;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tr {
      border-bottom: 1px solid #e5e7eb;
    }

    tr:last-child {
      border-bottom: none;
    }

    .course-cell {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .course-cell img {
      width: 80px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }

    .course-info h4 {
      font-size: 15px;
      margin-bottom: 4px;
    }

    .course-info span {
      font-size: 13px;
      color: #6b7280;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .rating i {
      color: #f59e0b;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .badge-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.3s;
    }

    .btn-icon:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-icon.btn-danger:hover {
      background: #fee2e2;
      color: #dc2626;
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

    @media (max-width: 1024px) {
      .courses-table {
        overflow-x: auto;
      }
      table {
        min-width: 800px;
      }
    }

    @media (max-width: 576px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }
  `]
})
export class InstructorCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getInstructorCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c.id !== id);
        }
      });
    }
  }
}