import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
}

export interface AdminPayment {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  courseId: number;
  courseTitle: string;
  paidAmount: number;
  paymentId: string;
  status: string;
  enrolledAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  blockUser(userId: number): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.apiUrl}/users/${userId}/block`, {});
  }

  unblockUser(userId: number): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.apiUrl}/users/${userId}/unblock`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  getPayments(): Observable<AdminPayment[]> {
    return this.http.get<AdminPayment[]>(`${this.apiUrl}/payments`);
  }
}
