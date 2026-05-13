import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-management.component.html',
  styleUrl: './department-management.component.css'
})
export class DepartmentManagementComponent {
  private readonly portalDataService = inject(PortalDataService);
  
  protected readonly departments = signal<DepartmentItem[]>([]);
  protected readonly departmentTotalCount = signal(0);
  protected readonly isDepartmentModalOpen = signal(false);
  protected readonly selectedDepartmentId = signal<string | null>(null);
  protected readonly departmentMessage = signal('');
  protected readonly departmentError = signal('');
  
  protected readonly departmentForm = {
    name: '',
    description: ''
  };

  constructor() {
    this.loadDepartments();
  }

  protected loadDepartments(): void {
    this.portalDataService.getDepartments().subscribe({
      next: (items) => {
        this.departments.set(items || []);
        this.departmentTotalCount.set(items?.length || 0);
      },
      error: () => this.departments.set([])
    });
  }

  protected selectDepartment(item: DepartmentItem): void {
    this.selectedDepartmentId.set(item.id ?? null);
    this.departmentForm.name = item.name;
    this.departmentForm.description = item.description ?? '';
    this.departmentMessage.set('');
    this.departmentError.set('');
    this.isDepartmentModalOpen.set(true);
  }

  protected clearDepartmentSelection(): void {
    this.selectedDepartmentId.set(null);
    this.departmentForm.name = '';
    this.departmentForm.description = '';
    this.departmentMessage.set('');
    this.departmentError.set('');
    this.isDepartmentModalOpen.set(true);
  }

  protected closeDepartmentModal(): void {
    this.isDepartmentModalOpen.set(false);
  }

  protected createDepartment(): void {
    if (!this.departmentForm.name) {
      this.departmentError.set('Name la bat buoc.');
      return;
    }
    
    this.portalDataService.createDepartment({
      name: this.departmentForm.name,
      description: this.departmentForm.description
    }).subscribe({
      next: () => {
        this.departmentMessage.set('Bạn đã tạo phòng ban thành công.');
        this.loadDepartments();
        setTimeout(() => this.closeDepartmentModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.departmentError.set(err.error?.message || 'Không thể tạo phòng ban.');
      }
    });
  }

  protected saveDepartment(): void {
    const id = this.selectedDepartmentId();
    if (!id) return;
    this.portalDataService.updateDepartment(id, {
      name: this.departmentForm.name,
      description: this.departmentForm.description
    }).subscribe({
      next: () => {
        this.departmentMessage.set('Đã cập nhật thành công');
        // update local list immediately for instant UI feedback
        const updated = this.departments().map((d) =>
          d.id === id ? { ...d, name: this.departmentForm.name, description: this.departmentForm.description } : d
        );
        this.departments.set(updated);
        this.selectedDepartmentId.set(null);
        this.departmentForm.name = '';
        this.departmentForm.description = '';
        setTimeout(() => this.closeDepartmentModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        // Treat 200/204 as success in case backend returns empty body causing parse error
        if (err && (err.status === 200 || err.status === 204)) {
          this.departmentMessage.set('Đã cập nhật thành công');
          const updated = this.departments().map((d) =>
            d.id === id ? { ...d, name: this.departmentForm.name, description: this.departmentForm.description } : d
          );
          this.departments.set(updated);
          this.selectedDepartmentId.set(null);
          this.departmentForm.name = '';
          this.departmentForm.description = '';
          setTimeout(() => this.closeDepartmentModal(), 1000);
          return;
        }

        this.departmentError.set(err.error?.message || 'Không thể cập nhật.');
      }
    });
  }

  protected deleteSelectedDepartment(): void {
    const id = this.selectedDepartmentId();
    if (!id || !confirm('Bạn có chắc chắn muốn xóa phòng ban này? Thao tác này không thể hoàn tác.')) return;

    this.portalDataService.deleteDepartment(id).subscribe({
      next: () => {
        this.departmentMessage.set('Đã xóa phòng ban thành công.');
        // remove from local list so UI updates immediately
        const remaining = this.departments().filter((d) => d.id !== id);
        this.departments.set(remaining);
        this.departmentTotalCount.set(remaining.length);
        this.selectedDepartmentId.set(null);
        this.departmentForm.name = '';
        this.departmentForm.description = '';
        setTimeout(() => this.closeDepartmentModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        // Treat 200/204 as success in case backend returns empty body causing parse error
        if (err && (err.status === 200 || err.status === 204)) {
          this.departmentMessage.set('Đã xóa phòng ban thành công.');
          const remaining = this.departments().filter((d) => d.id !== id);
          this.departments.set(remaining);
          this.departmentTotalCount.set(remaining.length);
          this.selectedDepartmentId.set(null);
          this.departmentForm.name = '';
          this.departmentForm.description = '';
          setTimeout(() => this.closeDepartmentModal(), 1000);
          return;
        }

        this.departmentError.set(err.error?.message || 'Không thể cập nhật.');
      }
    });
  }
}
