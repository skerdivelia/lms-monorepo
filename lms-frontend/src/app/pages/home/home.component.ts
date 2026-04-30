import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Learn Without Limits</h1>
          <p>Access thousands of courses from expert instructors. Start your journey today.</p>
          <div class="hero-buttons">
            <a routerLink="/courses" class="btn btn-primary btn-lg">Explore Courses</a>
            <a routerLink="/register" class="btn btn-outline btn-lg">Get Started</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <h3>10K+</h3>
            <p>Students</p>
          </div>
          <div class="stat-item">
            <h3>500+</h3>
            <p>Courses</p>
          </div>
          <div class="stat-item">
            <h3>100+</h3>
            <p>Instructors</p>
          </div>
          <div class="stat-item">
            <h3>4.8</h3>
            <p>Rating</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Courses</h2>
          <p>Discover our most popular courses</p>
        </div>
        
        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else {
          <div class="courses-grid">
            @for (course of featuredCourses; track course.id) {
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
        }
        
        <div class="section-footer">
          <a routerLink="/courses" class="btn btn-outline">View All Courses</a>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section bg-light">
      <div class="container">
        <div class="section-header">
          <h2>Browse by Category</h2>
          <p>Find courses in your area of interest</p>
        </div>
        
        <div class="categories-grid">
          @for (category of categories; track category.id) {
            <a [routerLink]="['/courses']" [queryParams]="{category: category.id}" class="category-card">
              <i [class]="category.icon"></i>
              <h3>{{ category.name }}</h3>
              <p>{{ category.count }} courses</p>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Become an Instructor</h2>
          <p>Share your knowledge and earn money by teaching thousands of students worldwide.</p>
          <a routerLink="/register" class="btn btn-primary btn-lg">Start Teaching</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .hero-content p {
      font-size: 20px;
      margin-bottom: 32px;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .hero .btn-outline {
      border-color: white;
      color: white;
    }

    .hero .btn-outline:hover {
      background: white;
      color: #4f46e5;
    }

    .stats {
      background: white;
      padding: 48px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      text-align: center;
    }

    .stat-item h3 {
      font-size: 36px;
      color: #4f46e5;
      margin-bottom: 8px;
    }

    .stat-item p {
      color: #6b7280;
      font-weight: 500;
    }

    .section {
      padding: 64px 0;
    }

    .section.bg-light {
      background: #f9fafb;
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-header h2 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .section-header p {
      color: #6b7280;
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

    .section-footer {
      text-align: center;
      margin-top: 32px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .category-card {
      background: white;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .category-card i {
      font-size: 40px;
      color: #4f46e5;
      margin-bottom: 16px;
    }

    .category-card h3 {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .category-card p {
      color: #6b7280;
      font-size: 14px;
    }

    .cta {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 36px;
      margin-bottom: 16px;
    }

    .cta-content p {
      font-size: 18px;
      margin-bottom: 32px;
      opacity: 0.9;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    @media (max-width: 1024px) {
      .courses-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 32px;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .courses-grid, .categories-grid {
        grid-template-columns: 1fr;
      }
      .hero-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  loading = true;

  categories = [
    { id: 1, name: 'Programming', icon: 'fas fa-code', count: 120 },
    { id: 2, name: 'Business', icon: 'fas fa-briefcase', count: 85 },
    { id: 3, name: 'Design', icon: 'fas fa-palette', count: 65 },
    { id: 4, name: 'Marketing', icon: 'fas fa-bullhorn', count: 45 },
    { id: 5, name: 'Data Science', icon: 'fas fa-database', count: 55 },
    { id: 6, name: 'Photography', icon: 'fas fa-camera', count: 30 },
    { id: 7, name: 'Music', icon: 'fas fa-music', count: 40 },
    { id: 8, name: 'Health', icon: 'fas fa-heart', count: 35 }
  ];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadFeaturedCourses();
  }

  loadFeaturedCourses(): void {
    this.courseService.getTopCourses(6).subscribe({
      next: (courses) => {
        this.featuredCourses = courses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}