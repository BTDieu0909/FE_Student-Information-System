import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import {
  DepartmentItem,
  PortalDataService,
} from "../../../../core/services/portal-data.service";
import { DepartmentListComponent } from "../../components/department-list/department-list.component";
import { FacultyDetailComponent } from "../../components/faculty-detail/faculty-detail.component";

type DirectoryView = "departments" | "faculties";

@Component({
  selector: "app-departments-page",
  standalone: true,
  imports: [CommonModule, DepartmentListComponent, FacultyDetailComponent],
  templateUrl: "./departments-page.component.html",
  styleUrl: "./departments-page.component.css",
})
export class DepartmentsPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly departments = signal<DepartmentItem[]>([]);
  readonly activeView = signal<DirectoryView>("departments");
  readonly selectedFacultyPageKey = signal("mission");

  readonly facultyMenuOptions = [
    { key: "mission", label: "Chức năng, nhiệm vụ" },
    { key: "history", label: "Lịch sử, phát triển" },
    { key: "vision", label: "Sứ mệnh, tầm nhìn" },
    { key: "strategy", label: "Chiến lược phát triển" },
    { key: "staff", label: "Danh sách nhân sự, phân công nhiệm vụ" },
    { key: "structure", label: "Cơ cấu tổ chức" },
    { key: "facilities", label: "Cơ sở vật chất" },
  ];

  constructor() {
    this.portalDataService.getDepartments().subscribe({
      next: (response) => this.departments.set(response || []),
      error: () => this.departments.set([]),
    });
  }

  protected showDepartments(): void {
    this.activeView.set("departments");
  }

  protected showFaculties(pageKey = "mission"): void {
    this.activeView.set("faculties");
    this.selectedFacultyPageKey.set(pageKey);
  }

  protected pageHeaderTitle(): string {
    return this.activeView() === "faculties"
      ? "Khoa Công nghệ thông tin"
      : "Thông tin phòng ban";
  }

  protected pageHeaderDescription(): string {
    if (this.activeView() === "faculties") {
      const option = this.facultyMenuOptions.find(
        (o) => o.key === this.selectedFacultyPageKey(),
      );
      return option ? option.label : "Chi tiết về Khoa Công nghệ thông tin.";
    }
    return "Danh sách các phòng ban trong trường.";
  }
}
