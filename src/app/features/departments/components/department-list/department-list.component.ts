import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DepartmentItem } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {
  @Input() departments: DepartmentItem[] = [];

  protected getDescriptionLines(description?: string): string[] {
    if (!description) return ['Thông tin đang cập nhật.'];
    return description.split('|').map(s => s.trim()).filter(s => s.length > 0);
  }
}
