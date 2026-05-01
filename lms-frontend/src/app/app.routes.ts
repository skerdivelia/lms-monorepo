import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'my-courses',
    loadComponent: () => import('./pages/my-courses/my-courses.component').then(m => m.MyCoursesComponent)
  },
  {
    path: 'instructor/courses',
    loadComponent: () => import('./pages/instructor/courses/courses.component').then(m => m.InstructorCoursesComponent)
  },
  {
    path: 'instructor/courses/create',
    loadComponent: () => import('./pages/instructor/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: 'instructor/courses/:id/edit',
    loadComponent: () => import('./pages/instructor/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: 'checkout/:courseId',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'learn/:id',
    loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];