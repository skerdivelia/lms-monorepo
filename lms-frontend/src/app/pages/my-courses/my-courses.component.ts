import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
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