import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  processing = false;
  error = '';

  // Payment form
  cardNumber = '';
  expiry = '';
  cvc = '';
  cardName = '';
  address = '';
  city = '';
  zip = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.loadCourse(+courseId);
    }
  }

  loadCourse(id: number): void {
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

  get finalPrice(): number {
    if (!this.course) return 0;
    return this.course.discountPrice || this.course.price;
  }

  formatCardNumber(): void {
    const noSpaces = this.cardNumber.replaceAll(/\s/g, '');
    const formatted = noSpaces.replaceAll(/(.{4})/g, '$1 ').trim();
    this.cardNumber = formatted;
  }

  formatExpiry(): void {
    const digitsOnly = this.expiry.replaceAll(/\D/g, '');
    if (digitsOnly.length >= 2) {
      this.expiry = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2);
    } else {
      this.expiry = digitsOnly;
    }
  }

  processPayment(): void {
    if (!this.cardNumber || !this.expiry || !this.cvc || !this.cardName) {
      this.error = 'Please fill in all card details';
      return;
    }

    this.processing = true;
    this.error = '';

    if (this.course) {
      this.courseService.createPaymentIntent(this.course.id).subscribe({
        next: (response) => {
          // In a real app, you would use Stripe.js to process the payment
          // For demo purposes, we'll simulate a successful payment
          const paymentId = response.clientSecret || `demo-payment-${Date.now()}`;
          setTimeout(() => {
            this.courseService.enrollInCourse(this.course!.id, paymentId, this.finalPrice).subscribe({
              next: () => {
                this.router.navigate(['/my-courses']);
              },
              error: (err) => {
                this.processing = false;
                this.error = err.error?.message || 'Enrollment failed';
              }
            });
          }, 1500);
        },
        error: (err) => {
          this.processing = false;
          this.error = err.error?.message || 'Payment failed';
        }
      });
    }
  }
}