import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarNavigationComponent } from './components/sidebar-navigation/sidebar-navigation.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authService.restoreSession().subscribe();
  }

  protected isLoginPage(): boolean {
    return this.router.url.split('?')[0] === '/login';
  }

  protected goToProfileOrAdmin(): void {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.canAccessAdmin()) {
      this.router.navigate([this.authService.managementRoute()]);
    }
  }
}
