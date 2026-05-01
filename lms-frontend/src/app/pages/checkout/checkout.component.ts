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
  template: `
    <div class="checkout-page">
      <div class="container">
        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (course) {
          <div class="checkout-grid">
            <div class="checkout-form">
              <h1>Checkout</h1>
              <p class="subtitle">Complete your purchase</p>

              @if (error) {
                <div class="alert alert-danger">{{ error }}</div>
              }

              <div class="payment-methods">
                <h2>Payment Method</h2>
                <div class="method-cards">
                  <div class="method-card selected">
                    <i class="fab fa-cc-stripe"></i>
                    <span>Credit Card</span>
                  </div>
                  <div class="method-card disabled">
                    <i class="fab fa-paypal"></i>
                    <span>PayPal</span>
                  </div>
                </div>
              </div>

              <form (ngSubmit)="processPayment()">
                <div class="form-section">
                  <h3>Card Information</h3>
                  
                  <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      [(ngModel)]="cardNumber" 
                      name="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      (input)="formatCardNumber()"
                      required
                    >
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry" 
                        [(ngModel)]="expiry" 
                        name="expiry" 
                        placeholder="MM/YY"
                        maxlength="5"
                        (input)="formatExpiry()"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label for="cvc">CVC</label>
                      <input 
                        type="text" 
                        id="cvc" 
                        [(ngModel)]="cvc" 
                        name="cvc" 
                        placeholder="123"
                        maxlength="4"
                        required
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      [(ngModel)]="cardName" 
                      name="cardName" 
                      placeholder="John Doe"
                      required
                    >
                  </div>
                </div>

                <div class="form-section">
                  <h3>Billing Address</h3>
                  
                  <div class="form-group">
                    <label for="address">Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      [(ngModel)]="address" 
                      name="address" 
                      placeholder="123 Main St"
                      required
                    >
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="city">City</label>
                      <input 
                        type="text" 
                        id="city" 
                        [(ngModel)]="city" 
                        name="city" 
                        placeholder="New York"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label for="zip">ZIP Code</label>
                      <input 
                        type="text" 
                        id="zip" 
                        [(ngModel)]="zip" 
                        name="zip" 
                        placeholder="10001"
                        required
                      >
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block" [disabled]="processing">
                  @if (processing) {
                    <span class="spinner-small"></span> Processing...
                  } @else {
                    Pay \${{ finalPrice }}
                  }
                </button>

                <p class="secure-notice">
                  <i class="fas fa-lock"></i> Your payment is secure and encrypted
                </p>
              </form>
            </div>

            <div class="order-summary">
              <h2>Order Summary</h2>
              
              <div class="course-preview">
                <img [src]="course.thumbnail || 'https://via.placeholder.com/100x60'" [alt]="course.title">
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.instructor?.firstName }} {{ course.instructor?.lastName }}</p>
                </div>
              </div>

              <div class="summary-details">
                <div class="summary-row">
                  <span>Original Price</span>
                  <span class="original">\${{ course.price }}</span>
                </div>
                @if (course.discountPrice && course.discountPrice < course.price) {
                  <div class="summary-row discount">
                    <span>Discount</span>
                    <span>-\${{ course.price - course.discountPrice }}</span>
                  </div>
                }
                <div class="summary-row total">
                  <span>Total</span>
                  <span>\${{ finalPrice }}</span>
                </div>
              </div>

              <div class="guarantee">
                <i class="fas fa-shield-alt"></i>
                <div>
                  <strong>30-Day Money-Back Guarantee</strong>
                  <p>If you're not satisfied, get a full refund within 30 days.</p>
                </div>
              </div>

              <a [routerLink]="['/courses', course.id]" class="back-link">
                <i class="fas fa-arrow-left"></i> Back to course
              </a>
            </div>
          </div>
        } @else {
          <div class="not-found">
            <h2>Course not found</h2>
            <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      padding: 40px 0;
      background: #f9fafb;
      min-height: calc(100vh - 80px);
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 32px;
    }

    .checkout-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .checkout-form h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
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

    .payment-methods {
      margin-bottom: 32px;
    }

    .payment-methods h2 {
      font-size: 18px;
      margin-bottom: 16px;
    }

    .method-cards {
      display: flex;
      gap: 12px;
    }

    .method-card {
      flex: 1;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .method-card.selected {
      border-color: #4f46e5;
      background: #eef2ff;
    }

    .method-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .method-card i {
      font-size: 24px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      font-size: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      border-color: #4f46e5;
      outline: none;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .btn-block {
      width: 100%;
      padding: 16px;
      font-size: 16px;
      margin-bottom: 16px;
    }

    .secure-notice {
      text-align: center;
      color: #6b7280;
      font-size: 13px;
    }

    .secure-notice i {
      color: #10b981;
      margin-right: 4px;
    }

    .order-summary {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      height: fit-content;
      position: sticky;
      top: 24px;
    }

    .order-summary h2 {
      font-size: 20px;
      margin-bottom: 24px;
    }

    .course-preview {
      display: flex;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .course-preview img {
      width: 100px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .course-info h3 {
      font-size: 15px;
      margin-bottom: 4px;
    }

    .course-info p {
      color: #6b7280;
      font-size: 13px;
    }

    .summary-details {
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .summary-row .original {
      text-decoration: line-through;
      color: #9ca3af;
    }

    .summary-row.discount {
      color: #10b981;
    }

    .summary-row.total {
      border-top: 1px solid #e5e7eb;
      margin-top: 8px;
      padding-top: 16px;
      font-size: 18px;
      font-weight: 700;
    }

    .guarantee {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .guarantee i {
      font-size: 24px;
      color: #10b981;
    }

    .guarantee strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .guarantee p {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
    }

    .back-link:hover {
      color: #4f46e5;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .not-found {
      text-align: center;
      padding: 64px;
    }

    .not-found h2 {
      margin-bottom: 24px;
    }

    .spinner-small {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }
      .order-summary {
        position: static;
      }
    }
  `]
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