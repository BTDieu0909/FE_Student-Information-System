import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.css'
})
export class SidebarNavigationComponent {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  protected readonly navItems = [
    { label: 'Trang chủ', route: '/home', description: 'Tổng quan hệ thống', icon: 'home' },
    { label: 'Tra cứu AI', route: '/chat', description: 'Hỏi đáp thông minh', icon: 'smart_toy' },
    { label: 'Kho tài liệu', route: '/documents', description: 'Thư viện tài liệu', icon: 'folder_open' },
    { label: 'FAQ', route: '/faq', description: 'Câu hỏi thường gặp', icon: 'quiz' },
    { label: 'Phòng ban', route: '/departments', description: 'Thông tin liên hệ', icon: 'contact_support' }
  ];

  protected managementRoute(): string {
    return this.authService.managementRoute();
  }

  protected currentUserLabel(): string {
    return this.authService.currentUser()?.fullName || this.authService.currentUser()?.username || 'Nguoi dung';
  }

  protected roleLabel(): string {
    return this.authService.isAdmin() ? 'Admin' : 'Staff';
  }

  protected isManagementPage(): boolean {
    return this.router.url.startsWith('/admin') || this.router.url.startsWith('/staff');
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
