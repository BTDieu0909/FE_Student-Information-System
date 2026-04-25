import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import {
  DepartmentItem,
  PortalDataService,
} from "../../../../core/services/portal-data.service";
import { DepartmentListComponent } from "../../components/department-list/department-list.component";

@Component({
  selector: "app-departments-page",
  standalone: true,
  imports: [CommonModule, DepartmentListComponent],
  templateUrl: "./departments-page.component.html",
  styleUrl: "./departments-page.component.css",
})
export class DepartmentsPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly departments = signal<DepartmentItem[]>([]);

  constructor() {
    this.portalDataService.getDepartments().subscribe({
      next: (response) => this.departments.set(response || []),
      error: () => this.departments.set([]),
    });
  }

  protected pageHeaderTitle(): string {
    return "Thông tin phòng ban";
  }

  protected pageHeaderDescription(): string {
    return "Danh sách các phòng ban trong trường.";
  }
}
