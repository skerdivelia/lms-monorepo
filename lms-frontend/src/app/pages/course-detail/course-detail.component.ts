import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService, Course } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  isLoggedIn = false;
  isEnrolled = false;
  isInstructor = false;
  isAdmin = false;
  isStudent = false;
  expandedLessons = new Set<number>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly authService: AuthService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isInstructor = this.authService.isInstructor();
    this.isAdmin = this.authService.isAdmin();
    this.isStudent = this.authService.isStudent();
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
    if (this.authService.isStudent()) {
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

  isYouTubeUrl(url: string): boolean {
    return /(?:youtu\.be\/|youtube\.com\/)/i.test(url);
  }

  canViewLessonVideos(): boolean {
    return this.isEnrolled || this.isInstructor || this.isAdmin;
  }

  getEmbedUrl(url: string): SafeResourceUrl | string {
    if (!this.isYouTubeUrl(url)) {
      return url;
    }

    const videoId = this.getYouTubeVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getYouTubeVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const result = regex.exec(url);
    return result ? result[1] : url;
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

  goToInstructorDashboard(): void {
    this.router.navigate(['/instructor/courses']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin']);
  }

  startLearning(): void {
    if (this.course) {
      this.router.navigate(['/learn', this.course.id]);
    }
  }
}