import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-settings.component.html',
  styleUrls: ['./ai-settings.component.css']
})
export class AiSettingsComponent implements OnInit {
  private adminService = inject(AdminService);
  
  readonly enableFaqScan = signal<boolean>(true);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly message = signal<string>('');
  readonly error = signal<string>('');

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.adminService.getSystemSetting('EnableFaqScan').subscribe({
      next: (res) => {
        this.enableFaqScan.set(res.value.toLowerCase() === 'true');
        this.isLoading.set(false);
      },
      error: () => {
        // Default to true if not found or error
        this.enableFaqScan.set(true);
        this.isLoading.set(false);
      }
    });
  }

  toggleFaqScan(): void {
    const newValue = !this.enableFaqScan();
    this.isSaving.set(true);
    this.message.set('');
    this.error.set('');

    this.adminService.updateSystemSetting('EnableFaqScan', newValue.toString()).subscribe({
      next: (res) => {
        this.enableFaqScan.set(res.value.toLowerCase() === 'true');
        this.message.set('Đã cập nhật cấu hình thành công.');
        this.isSaving.set(false);
        setTimeout(() => this.message.set(''), 3000);
      },
      error: () => {
        this.error.set('Lỗi khi cập nhật cấu hình.');
        this.isSaving.set(false);
      }
    });
  }
}
