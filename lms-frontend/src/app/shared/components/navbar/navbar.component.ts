import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu = false;

  private authService = inject(AuthService);

  get authServiceGetter() {
    return this.authService;
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'U';
  }

  logout(): void {
    this.authService.logout();
    this.showMenu = false;
  }
}