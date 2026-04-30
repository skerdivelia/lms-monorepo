import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="register-page">
      <div class="register-container">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Start your learning journey today</p>
        </div>

        @if (error) {
          <div class="alert alert-danger">
            {{ error }}
          </div>
        }

        @if (success) {
          <div class="alert alert-success">
            Account created successfully! Redirecting to login...
          </div>
        }

        <form (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                [(ngModel)]="firstName" 
                name="firstName" 
                placeholder="John"
                required
              >
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                [(ngModel)]="lastName" 
                name="lastName" 
                placeholder="Doe"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="john@example.com"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Create a strong password"
              required
              minlength="6"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password"
              required
            >
          </div>

          <div class="form-group">
            <label for="role">I want to</label>
            <select id="role" [(ngModel)]="role" name="role">
              <option value="STUDENT">Learn new skills</option>
              <option value="INSTRUCTOR">Teach courses</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" [(ngModel)]="agreeTerms" name="agreeTerms" required>
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            @if (loading) {
              <span class="spinner-small"></span>
            } @else {
              Create Account
            }
          </button>
        </form>

        <div class="register-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
      padding: 24px;
    }

    .register-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 48px;
      width: 100%;
      max-width: 520px;
    }

    .register-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .register-header h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .register-header p {
      color: #6b7280;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .alert-danger {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #4f46e5;
      outline: none;
    }

    .checkbox {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox input {
      width: 16px;
      height: 16px;
      margin-top: 2px;
    }

    .checkbox a {
      color: #4f46e5;
      text-decoration: none;
    }

    .checkbox a:hover {
      text-decoration: underline;
    }

    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      margin-top: 8px;
    }

    .register-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .register-footer p {
      color: #6b7280;
    }

    .register-footer a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
    }

    .register-footer a:hover {
      text-decoration: underline;
    }

    .spinner-small {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 576px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'STUDENT';
  agreeTerms = false;
  loading = false;
  error = '';
  success = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.error = '';

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (!this.agreeTerms) {
      this.error = 'Please agree to the terms and conditions';
      return;
    }

    this.loading = true;

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}