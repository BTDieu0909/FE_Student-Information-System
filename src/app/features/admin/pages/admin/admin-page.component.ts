import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { SearchLogSummary, PortalDataService, CategoryItem, DepartmentItem } from "../../../../core/services/portal-data.service";
import { DocumentManagementComponent } from "../../components/document-management/document-management.component";
import { FaqManagementComponent } from "../../components/faq-management/faq-management.component";
import { CategoryManagementComponent } from "../../components/category-management/category-management.component";
import { DepartmentManagementComponent } from "../../components/department-management/department-management.component";
import { ActorManagementComponent } from "../../components/actor-management/actor-management.component";
import { SearchLogViewerComponent } from "../../components/search-log-viewer/search-log-viewer.component";
import { AdminStatsComponent } from "../../components/admin-stats/admin-stats.component";

@Component({
  selector: "app-admin-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminStatsComponent,
    DocumentManagementComponent,
    FaqManagementComponent,
    CategoryManagementComponent,
    DepartmentManagementComponent,
    ActorManagementComponent,
    SearchLogViewerComponent
  ],
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly portalDataService = inject(PortalDataService);

  protected readonly summary = signal<SearchLogSummary | null>(null);
  protected readonly documentSearchQuery = signal<string>("");
  protected readonly sections = signal<{ key: string; label: string }[]>([]);
  protected readonly activeSection = signal<string>("documents");
  
  protected readonly departments = signal<DepartmentItem[]>([]);
  protected readonly categories = signal<CategoryItem[]>([]);

  constructor() {
    this.sections.set(this.buildSections());
    this.loadCommonData();
  }

  private loadCommonData(): void {
    this.portalDataService.getDepartments().subscribe(items => this.departments.set(items || []));
    this.portalDataService.getCategories().subscribe(items => this.categories.set(items || []));
    this.loadSummary();
  }

  private loadSummary(): void {
    this.portalDataService.getSearchLogSummary().subscribe(s => this.summary.set(s));
  }

  protected searchDocuments(): void {
    // Logic tìm kiếm tài liệu có thể điều hướng hoặc gọi trực tiếp sub-component nếu cần
    console.log("Searching for:", this.documentSearchQuery());
  }

  protected isAdminView(): boolean {
    return (
      this.route.snapshot.data["roleView"] === "admin" &&
      this.authService.getRole() === "admin"
    );
  }

  protected username(): string {
    return this.authService.currentUser()?.username || "tai khoan";
  }

  protected userDisplayName(): string {
    return (
      this.authService.currentUser()?.fullName ||
      this.authService.currentUser()?.username ||
      "Nguoi dung"
    );
  }

  protected setActiveSection(sectionKey: string): void {
    this.activeSection.set(sectionKey);
  }

  protected isActiveSection(sectionKey: string): boolean {
    return this.activeSection() === sectionKey;
  }

  private buildSections(): { key: string; label: string }[] {
    const items = [
      { key: "documents", label: "Quản trị tài liệu" },
      { key: "faqs", label: "Quản trị FAQ" },
      { key: "categories", label: "Quản trị danh mục" },
      { key: "departments", label: "Quản trị phòng ban" },
      { key: "search-logs", label: "Xem thống kê tra cứu" },
    ];

    if (this.isAdminView()) {
      items.push({ key: "actors", label: "Tài khoản nội bộ admin" });
    }

    return items;
  }
}
