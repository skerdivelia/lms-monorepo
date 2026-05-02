import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  enrolledCourses: Course[] = [];
  myCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  loading = true;
  isInstructor = false;
  isAdmin = false;
  isStudent = false;
  completedLessons = 0;
  totalHours = 0;
  certificates = 0;
  totalStudents = 0;
  averageRating = 0;
  totalEarnings = 0;

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.isInstructor = this.authService.isInstructor();
    this.isStudent = this.authService.isStudent();

    // Load enrolled courses only for students
    if (this.isStudent) {
      this.courseService.getEnrolledCourses().subscribe({
        next: (courses) => {
          this.enrolledCourses = courses;
          this.calculateStats();
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }

    // Load instructor's courses and calculate stats
    if (this.isInstructor) {
      this.courseService.getInstructorCourses().subscribe({
        next: (courses) => {
          this.myCourses = courses;
          this.calculateInstructorStats();
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

  calculateInstructorStats(): void {
    // Calculate total students across all courses
    this.totalStudents = this.myCourses.reduce((acc, course) => acc + (course.totalStudents || 0), 0);
    
    // Calculate average rating across all courses
    const coursesWithRating = this.myCourses.filter(c => c.rating && c.rating > 0);
    this.averageRating = coursesWithRating.length > 0 
      ? coursesWithRating.reduce((acc, c) => acc + (c.rating || 0), 0) / coursesWithRating.length 
      : 0;
    
    // Calculate total earnings (mock data - in real app, this would come from enrollment data)
    this.totalEarnings = this.myCourses.reduce((acc, course) => acc + (course.price * (course.totalStudents || 0)), 0);
  }

  getProgress(course: Course): number {
    // Mock progress - in real app, this would come from enrollment data
    return Math.floor(Math.random() * 80) + 10;
  }
}