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
    { label: 'Trang chu', route: '/home', description: 'Tong quan he thong' },
    { label: 'Tra cuu AI', route: '/chat', description: 'Hoi dap bang ngon ngu tu nhien' },
    { label: 'Kho tai lieu', route: '/documents', description: 'Tim kiem tai lieu' },
    { label: 'Cau hoi thuong gap', route: '/faq', description: 'Collection FAQs' },
    { label: 'Phong ban', route: '/departments', description: 'Collection Departments' }
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
    this.router.navigate(['/login']);
  }
}
