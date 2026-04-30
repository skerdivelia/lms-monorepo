import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course, Lesson } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  course: any = {
    title: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    level: '',
    price: 0,
    discountPrice: null,
    thumbnail: '',
    learningPoints: [''],
    lessons: []
  };
  
  isEditMode = false;
  courseId: number | null = null;
  saving = false;
  error = '';

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourse();
    }
  }

  loadCourse(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.course = {
            ...course,
            categoryId: course.category?.id?.toString() || '',
            learningPoints: course.learningPoints?.length ? course.learningPoints : [''],
            lessons: course.lessons || []
          };
        },
        error: () => {
          this.error = 'Failed to load course';
        }
      });
    }
  }

  addLearningPoint(): void {
    this.course.learningPoints.push('');
  }

  removeLearningPoint(index: number): void {
    if (this.course.learningPoints.length > 1) {
      this.course.learningPoints.splice(index, 1);
    }
  }

  addLesson(): void {
    this.course.lessons.push({
      title: '',
      content: '',
      duration: 10,
      videoUrl: ''
    });
  }

  removeLesson(index: number): void {
    this.course.lessons.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.course.title || !this.course.shortDescription || !this.course.description) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.error = '';

    const courseData = {
      ...this.course,
      categoryId: +this.course.categoryId,
      learningPoints: this.course.learningPoints.filter((p: string) => p.trim() !== '')
    };

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          this.router.navigate(['/instructor/courses']);
        },
        error: (err) => {
          this.saving = false;
          this.error = err.error?.message || 'Failed to update course';
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          this.router.navigate(['/instructor/courses']);
        },
        error: (err) => {
          this.saving = false;
          this.error = err.error?.message || 'Failed to create course';
        }
      });
    }
  }
}