import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course, PagedResponse } from '../../core/services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
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