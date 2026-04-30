import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  error = '';
  returnUrl = '/';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({email: this.email, password: this.password}).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password';
      }
    });
  }
}