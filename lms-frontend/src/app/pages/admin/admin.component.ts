import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser, AdminPayment } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>Admin Control Center</h1>
            <p>Manage users, instructors, and monitor payments</p>
          </div>
        </div>

        @if (!isAdmin) {
          <div class="access-denied">
            <i class="fas fa-lock"></i>
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
            <a routerLink="/" class="btn btn-primary">Go Home</a>
          </div>
        } @else {
          @if (loading) {
            <div class="loading">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="admin-tabs">
              <button 
                [class.active]="activeTab === 'users'" 
                (click)="activeTab = 'users'"
                class="tab-btn">
                <i class="fas fa-users"></i> Users & Instructors
              </button>
              <button 
                [class.active]="activeTab === 'payments'" 
                (click)="activeTab = 'payments'"
                class="tab-btn">
                <i class="fas fa-file-invoice-dollar"></i> Payments
              </button>
            </div>

            <!-- Users & Instructors Tab -->
            @if (activeTab === 'users') {
              <section class="admin-section">
                <h2>Users & Instructors Management</h2>
                
                @if (users.length === 0) {
                  <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No users found</h3>
                  </div>
                } @else {
                  <div class="users-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (user of users; track user.id) {
                          <tr [class.disabled]="!user.enabled">
                            <td>
                              <div class="user-name">
                                <div class="avatar">{{ getUserInitials(user) }}</div>
                                <span>{{ user.firstName }} {{ user.lastName }}</span>
                              </div>
                            </td>
                            <td>{{ user.email }}</td>
                            <td>
                              <span class="badge" [ngClass]="'badge-' + user.role.toLowerCase()">
                                {{ user.role }}
                              </span>
                            </td>
                            <td>
                              <span class="status-badge" [ngClass]="user.enabled ? 'active' : 'blocked'">
                                {{ user.enabled ? 'Active' : 'Blocked' }}
                              </span>
                            </td>
                            <td>{{ formatDate(user.createdAt) }}</td>
                            <td>
                              <div class="actions">
                                @if (user.enabled) {
                                  <button class="btn-icon btn-danger" (click)="blockUser(user.id)" title="Block">
                                    <i class="fas fa-ban"></i>
                                  </button>
                                } @else {
                                  <button class="btn-icon btn-success" (click)="unblockUser(user.id)" title="Unblock">
                                    <i class="fas fa-check"></i>
                                  </button>
                                }
                                <button class="btn-icon btn-delete" (click)="deleteUser(user.id)" title="Delete">
                                  <i class="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </section>
            }

            <!-- Payments Tab -->
            @if (activeTab === 'payments') {
              <section class="admin-section">
                <h2>Payment History</h2>
                
                @if (payments.length === 0) {
                  <div class="empty-state">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <h3>No payments yet</h3>
                  </div>
                } @else {
                  <div class="payments-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Course</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Payment ID</th>
                          <th>Enrolled At</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (payment of payments; track payment.id) {
                          <tr>
                            <td>
                              <div class="payment-student">
                                <strong>{{ payment.userName }}</strong>
                                <small>{{ payment.userEmail }}</small>
                              </div>
                            </td>
                            <td>{{ payment.courseTitle }}</td>
                            <td class="amount">\${{ payment.paidAmount.toFixed(2) }}</td>
                            <td>
                              <span class="status-badge active">{{ payment.status }}</span>
                            </td>
                            <td><code>{{ payment.paymentId }}</code></td>
                            <td>{{ formatDate(payment.enrolledAt) }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </section>
            }
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 40px 0;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #6b7280;
    }

    .access-denied {
      text-align: center;
      padding: 80px 40px;
      background: #fef2f2;
      border-radius: 12px;
      border: 2px solid #fecaca;
    }

    .access-denied i {
      font-size: 64px;
      color: #dc2626;
      margin-bottom: 16px;
    }

    .access-denied h2 {
      margin-bottom: 8px;
    }

    .access-denied p {
      color: #6b7280;
      margin-bottom: 24px;
    }

    .admin-tabs {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      border-bottom: 2px solid #e5e7eb;
    }

    .tab-btn {
      padding: 12px 20px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      color: #6b7280;
      font-weight: 500;
      transition: all 0.3s;
    }

    .tab-btn:hover {
      color: #374151;
    }

    .tab-btn.active {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }

    .tab-btn i {
      margin-right: 8px;
    }

    .admin-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .admin-section h2 {
      margin-bottom: 24px;
      font-size: 20px;
    }

    .users-table,
    .payments-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 16px 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr.disabled {
      opacity: 0.6;
      background: #f9fafb;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-student {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-instructor {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-admin {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.blocked {
      background: #fee2e2;
      color: #dc2626;
    }

    .payment-student {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .payment-student small {
      color: #6b7280;
      font-size: 12px;
    }

    .amount {
      font-weight: 600;
      color: #10b981;
    }

    code {
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.3s;
    }

    .btn-icon:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-icon.btn-danger:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-icon.btn-success:hover {
      background: #d1fae5;
      color: #059669;
    }

    .btn-icon.btn-delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .empty-state i {
      font-size: 48px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: #374151;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    @media (max-width: 1024px) {
      .users-table,
      .payments-table {
        overflow-x: auto;
      }
      table {
        min-width: 800px;
      }
    }

    @media (max-width: 576px) {
      .admin-tabs {
        flex-direction: column;
        border-bottom: none;
      }
      .tab-btn {
        border-bottom: 2px solid #e5e7eb;
      }
      .tab-btn.active {
        border-bottom-color: #4f46e5;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  users: AdminUser[] = [];
  payments: AdminPayment[] = [];
  loading = true;
  activeTab: 'users' | 'payments' = 'users';
  isAdmin = false;

  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      }
    });

    this.adminService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  blockUser(userId: number): void {
    if (confirm('Are you sure you want to block this user?')) {
      this.adminService.blockUser(userId).subscribe({
        next: (updated) => {
          const user = this.users.find(u => u.id === userId);
          if (user) {
            user.enabled = updated.enabled;
          }
        }
      });
    }
  }

  unblockUser(userId: number): void {
    this.adminService.unblockUser(userId).subscribe({
      next: (updated) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.enabled = updated.enabled;
        }
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
        }
      });
    }
  }

  getUserInitials(user: AdminUser): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
