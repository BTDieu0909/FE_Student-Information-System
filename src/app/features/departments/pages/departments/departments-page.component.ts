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
  readonly selectedFaculty = signal('cntt');

  readonly faculties = [
    { key: 'cntt', label: 'Khoa Công nghệ thông tin', shortLabel: 'Công nghệ thông tin' },
    { key: 'kinhte', label: 'Khoa Kinh tế & Kế toán', shortLabel: 'Kinh tế & Kế toán' },
    { key: 'suhpam', label: 'Khoa Sư phạm', shortLabel: 'Sư phạm' },
    { key: 'khoahoctn', label: 'Khoa Khoa học tự nhiên', shortLabel: 'Khoa học tự nhiên' },
    { key: 'ngoaingu', label: 'Khoa Ngoại ngữ', shortLabel: 'Ngoại ngữ' },
    { key: 'xahoi', label: 'Khoa Khoa học xã hội & Nhân văn', shortLabel: 'KH Xã hội & Nhân văn' },
  ];

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

  protected selectFaculty(facultyKey: string): void {
    this.selectedFaculty.set(facultyKey);
    this.showFaculties('mission');
  }

  protected currentFacultyLabel(): string {
    const f = this.faculties.find(fac => fac.key === this.selectedFaculty());
    return f ? f.label : 'Khoa Công nghệ thông tin';
  }

  protected currentFacultyKicker(): string {
    const f = this.faculties.find(fac => fac.key === this.selectedFaculty());
    return f ? f.label.toUpperCase() : 'KHOA CÔNG NGHỆ THÔNG TIN';
  }

  protected pageHeaderTitle(): string {
    return this.activeView() === "faculties"
      ? this.currentFacultyLabel()
      : "Thông tin phòng ban";
  }

  protected pageHeaderDescription(): string {
    if (this.activeView() === "faculties") {
      if (this.selectedFaculty() !== 'cntt') {
        return `Đang cập nhật dữ liệu.`;
      }
      const option = this.facultyMenuOptions.find(
        (o) => o.key === this.selectedFacultyPageKey(),
      );
      return option ? option.label : `Chi tiết về ${this.currentFacultyLabel()}.`;
    }
    return "Danh sách các phòng ban trong trường.";
  }
}
