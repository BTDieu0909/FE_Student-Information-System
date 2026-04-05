import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavigationComponent } from './components/sidebar-navigation/sidebar-navigation.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.restoreSession().subscribe();
  }
}
