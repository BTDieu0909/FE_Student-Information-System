import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, signal } from "@angular/core";
import { DepartmentItem, PortalDataService } from "../../../../core/services/portal-data.service";
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
  private facultyMenuCloseTimer: number | null = null;

  readonly departments = signal<DepartmentItem[]>([]);
  readonly activeView = signal<DirectoryView>("departments");
  readonly isFacultyMenuOpen = signal(false);
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

  @HostListener("document:click")
  protected closeFacultyMenu(): void {
    if (this.isFacultyMenuOpen()) {
      this.isFacultyMenuOpen.set(false);
    }
  }

  protected showDepartments(event?: Event): void {
    event?.stopPropagation();
    this.activeView.set("departments");
    this.isFacultyMenuOpen.set(false);
  }

  protected selectFacultyPage(pageKey: string, event?: Event): void {
    event?.stopPropagation();
    this.activeView.set("faculties");
    this.selectedFacultyPageKey.set(pageKey);
    this.isFacultyMenuOpen.set(false);
  }

  protected openFacultyMenu(): void {
    if (this.facultyMenuCloseTimer !== null) {
      window.clearTimeout(this.facultyMenuCloseTimer);
      this.facultyMenuCloseTimer = null;
    }
    this.isFacultyMenuOpen.set(true);
  }

  protected scheduleFacultyMenuClose(): void {
    if (this.facultyMenuCloseTimer !== null) {
      window.clearTimeout(this.facultyMenuCloseTimer);
    }
    this.facultyMenuCloseTimer = window.setTimeout(() => {
      this.isFacultyMenuOpen.set(false);
      this.facultyMenuCloseTimer = null;
    }, 160);
  }

  protected pageHeaderTitle(): string {
    return this.activeView() === "faculties" ? "Khoa Công nghệ thông tin" : "Thông tin phòng ban";
  }

  protected pageHeaderDescription(): string {
    if (this.activeView() === "faculties") {
      const option = this.facultyMenuOptions.find(o => o.key === this.selectedFacultyPageKey());
      return option ? option.label : "Chi tiết về Khoa Công nghệ thông tin.";
    }
    return "Danh sách các phòng ban trong trường.";
  }
}
