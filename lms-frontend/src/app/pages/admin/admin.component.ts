import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser, AdminPayment } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
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
