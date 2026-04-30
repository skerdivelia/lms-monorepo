import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course, PagedResponse } from '../../core/services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="courses-page">
      <div class="container">
        <div class="page-header">
          <h1>All Courses</h1>
          <p>Explore our collection of courses</p>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search courses..." 
              [(ngModel)]="searchKeyword"
              (keyup.enter)="search()"
            >
          </div>
          
          <select [(ngModel)]="selectedLevel" (change)="filterByLevel()">
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else {
          @if (courses.length === 0) {
            <div class="empty-state">
              <i class="fas fa-book-open"></i>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          } @else {
            <div class="courses-grid">
              @for (course of courses; track course.id) {
                <div class="course-card">
                  <div class="course-thumbnail">
                    <img [src]="course.thumbnail || 'https://via.placeholder.com/300x200'" [alt]="course.title">
                    <span class="course-level badge badge-primary">{{ course.level }}</span>
                  </div>
                  <div class="course-content">
                    <h3>{{ course.title }}</h3>
                    <p class="course-description">{{ course.shortDescription }}</p>
                    <div class="course-meta">
                      <span><i class="fas fa-user"></i> {{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</span>
                      <span><i class="fas fa-star"></i> {{ course.rating?.toFixed(1) || '0.0' }}</span>
                      <span><i class="fas fa-users"></i> {{ course.totalStudents }}</span>
                    </div>
                    <div class="course-price">
                      @if (course.discountPrice && course.discountPrice < course.price) {
                        <span class="original-price">\${{ course.price }}</span>
                        <span class="discount-price">\${{ course.discountPrice }}</span>
                      } @else {
                        <span>\${{ course.price }}</span>
                      }
                    </div>
                    <a [routerLink]="['/courses', course.id]" class="btn btn-primary">View Course</a>
                  </div>
                </div>
              }
            </div>

            @if (totalPages > 1) {
              <div class="pagination">
                <button 
                  [disabled]="currentPage === 0" 
                  (click)="goToPage(currentPage - 1)"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                @for (page of getPageNumbers(); track page) {
                  <button 
                    [class.active]="page === currentPage"
                    (click)="goToPage(page)"
                  >
                    {{ page + 1 }}
                  </button>
                }
                
                <button 
                  [disabled]="currentPage >= totalPages - 1" 
                  (click)="goToPage(currentPage + 1)"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .courses-page {
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

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .search-box {
      flex: 1;
      position: relative;
    }

    .search-box i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    .search-box input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
    }

    .search-box input:focus {
      border-color: #4f46e5;
      outline: none;
    }

    .filters select {
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      min-width: 150px;
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
      height: 180px;
      overflow: hidden;
    }

    .course-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-level {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .course-content {
      padding: 20px;
    }

    .course-content h3 {
      font-size: 18px;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-description {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-meta {
      display: flex;
      gap: 16px;
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .course-meta i {
      color: #f59e0b;
      margin-right: 4px;
    }

    .course-price {
      font-size: 20px;
      font-weight: 700;
      color: #4f46e5;
      margin-bottom: 16px;
    }

    .original-price {
      text-decoration: line-through;
      color: #9ca3af;
      font-size: 16px;
      margin-right: 8px;
    }

    .discount-price {
      color: #10b981;
    }

    .empty-state {
      text-align: center;
      padding: 64px;
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
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .pagination {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 48px;
    }

    .pagination button {
      padding: 8px 16px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .pagination button:hover:not(:disabled) {
      background: #4f46e5;
      color: white;
      border-color: #4f46e5;
    }

    .pagination button.active {
      background: #4f46e5;
      color: white;
      border-color: #4f46e5;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 1024px) {
      .courses-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .courses-grid {
        grid-template-columns: 1fr;
      }
      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 9;
  totalElements = 0;
  totalPages = 0;
  searchKeyword = '';
  selectedLevel = '';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) {
        this.searchKeyword = params['keyword'];
        this.search();
      } else {
        this.loadCourses();
      }
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getPublicCourses(this.currentPage, this.pageSize).subscribe({
      next: (response: PagedResponse<Course>) => {
        this.courses = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  search(): void {
    if (this.searchKeyword) {
      this.loading = true;
      this.courseService.searchCourses(this.searchKeyword, this.currentPage, this.pageSize).subscribe({
        next: (response: PagedResponse<Course>) => {
          this.courses = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loadCourses();
    }
  }

  filterByLevel(): void {
    // Implement level filtering
    this.loadCourses();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCourses();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages);
    
    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }
}