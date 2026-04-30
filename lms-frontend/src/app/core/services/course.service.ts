import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number;
  published: boolean;
  approved: boolean;
  requirements: string;
  outcomes: string;
  isPublished: boolean;
  totalLessons: number;
  totalReviews: number;
  learningPoints: string[];
  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    title: string;
    bio: string;
  };
  category: {
    id: number;
    name: string;
    icon: string;
  };
  rating: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

export interface CourseRequest {
  title: string;
  description: string;
  thumbnail: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number;
  requirements: string;
  outcomes: string;
  categoryId: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: number;
  videoUrl: string;
  orderIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PagedResponse<Course>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<PagedResponse<Course>>(this.apiUrl, { params });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getPublicCourses(page: number = 0, size: number = 10): Observable<PagedResponse<Course>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Course>>(`${this.apiUrl}/public`, { params });
  }

  getCoursesByInstructor(instructorId: number, page: number = 0, size: number = 10): Observable<PagedResponse<Course>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Course>>(`${this.apiUrl}/instructor/${instructorId}`, { params });
  }

  getCoursesByCategory(categoryId: number, page: number = 0, size: number = 10): Observable<PagedResponse<Course>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Course>>(`${this.apiUrl}/category/${categoryId}`, { params });
  }

  searchCourses(keyword: string, page: number = 0, size: number = 10): Observable<PagedResponse<Course>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Course>>(`${this.apiUrl}/search`, { params });
  }

  getTopCourses(limit: number = 10): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/top?limit=${limit}`);
  }

  getLatestCourses(limit: number = 10): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/latest?limit=${limit}`);
  }

  createCourse(course: CourseRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, course: CourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishCourse(id: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${id}/publish`, {});
  }

  approveCourse(id: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${id}/approve`, {});
  }

  // Enrollment methods
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.apiUrl}/enrollments/my-courses`);
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/instructor`);
  }

  checkEnrollment(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/enrollments/check/${courseId}`);
  }

  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/enrollments`, { courseId });
  }

  // Payment methods
  createPaymentIntent(courseId: number): Observable<{clientSecret: string}> {
    return this.http.post<{clientSecret: string}>(`${environment.apiUrl}/payments/create-intent`, { courseId });
  }
}