import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  loading = true;
  isInstructor = false;
  isAdmin = false;

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

  constructor(private readonly courseService: CourseService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isInstructor = this.authService.isInstructor();
    this.isAdmin = this.authService.isAdmin();
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