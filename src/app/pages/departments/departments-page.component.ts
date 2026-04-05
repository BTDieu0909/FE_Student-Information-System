import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DepartmentItem, PortalDataService } from '../../services/portal-data.service';

@Component({
  selector: 'app-departments-page',
  imports: [CommonModule],
  templateUrl: './departments-page.component.html',
  styleUrl: './departments-page.component.css'
})
export class DepartmentsPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly items = signal<DepartmentItem[]>([]);

  constructor() {
    this.portalDataService.getDepartments().subscribe({
      next: (response) => this.items.set(response)
    });
  }
}
