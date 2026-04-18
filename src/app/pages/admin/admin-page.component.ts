import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {
  ActorItem,
  CategoryItem,
  DepartmentItem,
  DocumentItem,
  FaqItem,
  FaqPayload,
  PortalDataService,
  SearchLogItem,
  SearchLogSummary,
  UpdateDocumentPayload,
} from "../../services/portal-data.service";

@Component({
  selector: "app-admin-page",
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {
  @ViewChild("documentFileInput")
  private documentFileInput?: ElementRef<HTMLInputElement>;
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly portalDataService = inject(PortalDataService);
  protected readonly sections = signal<{ key: string; label: string }[]>([]);

  protected readonly documents = signal<DocumentItem[]>([]);
  protected readonly faqs = signal<FaqItem[]>([]);
  protected readonly categoryTotalCount = signal(0);
  protected readonly departmentTotalCount = signal(0);
  protected readonly actorTotalCount = signal(0);
  protected readonly categories = signal<CategoryItem[]>([]);
  protected readonly selectedCategoryId = signal<string | null>(null);
  protected readonly categoryMessage = signal("");
  protected readonly categoryError = signal("");
  protected readonly isCategoryModalOpen = signal(false);

  protected readonly categoryForm = {
    name: "",
    slug: "",
  };
  protected readonly departments = signal<DepartmentItem[]>([]);
  protected readonly selectedDepartmentId = signal<string | null>(null);
  protected readonly departmentMessage = signal("");
  protected readonly departmentError = signal("");
  protected readonly isDepartmentModalOpen = signal(false);

  protected readonly departmentForm = {
    name: "",
    description: "",
  };
  protected readonly searchLogs = signal<SearchLogItem[]>([]);
  protected readonly searchLogQuery = signal("");
  protected readonly searchLogSource = signal<string | null>(null);
  protected readonly searchLogStart = signal("");
  protected readonly searchLogEnd = signal("");
  protected readonly searchLogCurrentPage = signal(1);
  protected readonly searchLogTotalPages = signal(1);
  protected readonly searchLogTotalCount = signal(0);
  protected readonly actors = signal<ActorItem[]>([]);
  protected readonly selectedActorId = signal<string | null>(null);
  protected readonly actorMessage = signal("");
  protected readonly actorError = signal("");
  protected readonly isActorModalOpen = signal(false);

  protected readonly actorForm = {
    username: "",
    fullName: "",
    role: "",
    departmentId: "",
  };
  protected readonly activeSection = signal<string>("documents");
  protected readonly selectedDocumentId = signal<string | null>(null);
  protected readonly selectedFaqId = signal<string | null>(null);
  protected readonly documentMessage = signal("");
  protected readonly documentError = signal("");
  protected readonly faqMessage = signal("");
  protected readonly faqError = signal("");
  protected readonly uploadFileName = signal("Chua chon file");
  protected readonly isChunkingDocument = signal(false);

  protected readonly documentSearchQuery = signal("");
  protected readonly documentCurrentPage = signal(1);
  protected readonly documentTotalPages = signal(1);
  protected readonly documentTotalCount = signal(0);
  protected readonly isDocumentModalOpen = signal(false);
  protected readonly isFaqModalOpen = signal(false);

  protected readonly searchSummary = signal<SearchLogSummary>({
    total: 0,
    ai: 0,
    faq: 0,
    fallback: 0,
    noData: 0,
    error: 0,
  });

  protected readonly documentForm = {
    title: "",
    departmentId: "",
    categoryId: "",
    fileLink: "",
  };

  protected readonly faqForm = {
    question: "",
    answer: "",
    departmentId: "",
    categoryId: "",
  };
  protected readonly faqTotalCount = signal(0);
  protected readonly faqSearchQuery = signal("");
  private selectedFile: File | null = null;

  constructor() {
    this.sections.set(this.buildSections());
    this.loadDashboard();
  }

  protected isAdminView(): boolean {
    return (
      this.route.snapshot.data["roleView"] === "admin" &&
      this.authService.getRole() === "admin"
    );
  }

  protected pageTitle(): string {
    return this.isAdminView() ? "Khu vuc quan tri admin" : "Khu vuc staff";
  }

  protected userDisplayName(): string {
    return (
      this.authService.currentUser()?.fullName ||
      this.authService.currentUser()?.username ||
      "Nguoi dung"
    );
  }

  protected username(): string {
    return this.authService.currentUser()?.username || "tai khoan";
  }

  protected documentPreview(): DocumentItem[] {
    return this.documents().slice(0, 3);
  }

  protected faqPreview(): FaqItem[] {
    return this.faqs().slice(0, 3);
  }

  protected categoryPreview(): CategoryItem[] {
    return this.categories().slice(0, 4);
  }

  protected departmentPreview(): DepartmentItem[] {
    return this.departments().slice(0, 4);
  }

  protected actorPreview(): ActorItem[] {
    return this.actors().slice(0, 4);
  }

  protected logPreview(): SearchLogItem[] {
    return this.searchLogs().slice(0, 5);
  }

  protected currentDocument(): DocumentItem | null {
    const parentFileId = this.selectedDocumentId();
    if (!parentFileId) {
      return null;
    }

    return (
      this.documents().find((item) => item.parentFileId === parentFileId) ??
      null
    );
  }

  protected currentDocumentFileName(): string {
    return this.currentDocument()?.fileName || "Khong co file hien tai";
  }

  protected isCurrentDocumentDepartmentMissing(): boolean {
    const current = this.currentDocument();
    if (!current?.departmentId) {
      return false;
    }

    return !this.departments().some((item) => item.id === current.departmentId);
  }

  protected isCurrentDocumentCategoryMissing(): boolean {
    const current = this.currentDocument();
    if (!current?.categoryId) {
      return false;
    }

    return !this.categories().some((item) => item.id === current.categoryId);
  }

  protected currentDocumentDepartmentId(): string {
    return this.currentDocument()?.departmentId || "";
  }

  protected currentDocumentCategoryId(): string {
    return this.currentDocument()?.categoryId || "";
  }

  protected currentFaq(): FaqItem | null {
    const faqId = this.selectedFaqId();
    if (!faqId) {
      return null;
    }

    return this.faqs().find((item) => item.id === faqId) ?? null;
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

  protected selectDocument(item: DocumentItem): void {
    this.selectedDocumentId.set(item.parentFileId ?? null);
    this.documentForm.title = item.title;
    this.documentForm.departmentId = item.departmentId ?? "";
    this.documentForm.categoryId = item.categoryId ?? "";
    this.selectedFile = null;
    this.documentForm.fileLink = "";
    this.resetDocumentFilePicker();
    this.documentMessage.set("");
    this.documentError.set("");
    this.isDocumentModalOpen.set(true);
  }

  protected clearDocumentSelection(): void {
    this.selectedDocumentId.set(null);
    this.documentForm.title = "";
    this.documentForm.departmentId = "";
    this.documentForm.categoryId = "";
    this.documentForm.fileLink = "";
    this.selectedFile = null;
    this.resetDocumentFilePicker();
    this.documentMessage.set("");
    this.documentError.set("");
    this.isDocumentModalOpen.set(true);
  }

  protected closeDocumentModal(): void {
    this.isDocumentModalOpen.set(false);
  }

  protected onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.uploadFileName.set(file?.name ?? "Chua chon file");
    if (file) {
      this.documentForm.fileLink = ""; // Clear link when file is selected
    }
  }

  protected selectFaq(item: FaqItem): void {
    this.selectedFaqId.set(item.id ?? null);
    this.faqForm.question = item.question;
    this.faqForm.answer = item.answer;
    this.faqForm.departmentId = item.departmentId ?? "";
    this.faqForm.categoryId = item.categoryId ?? "";
    this.faqMessage.set("");
    this.faqError.set("");
    this.isFaqModalOpen.set(true);
  }

  protected selectCategory(item: CategoryItem): void {
    this.selectedCategoryId.set(item.id ?? null);
    this.categoryForm.name = item.name;
    this.categoryForm.slug = item.slug;
    this.categoryMessage.set("");
    this.categoryError.set("");
    this.isCategoryModalOpen.set(true);
  }

  protected selectDepartment(item: DepartmentItem): void {
    this.selectedDepartmentId.set(item.id ?? null);
    this.departmentForm.name = item.name;
    this.departmentForm.description = item.description ?? "";
    this.departmentMessage.set("");
    this.departmentError.set("");
    this.isDepartmentModalOpen.set(true);
  }

  protected selectActor(item: ActorItem): void {
    this.selectedActorId.set(item.id ?? null);
    this.actorForm.username = item.username;
    this.actorForm.fullName = item.fullName;
    this.actorForm.role = item.role;
    this.actorForm.departmentId = item.departmentId ?? "";
    this.actorMessage.set("");
    this.actorError.set("");
    this.isActorModalOpen.set(true);
  }

  protected clearActorSelection(): void {
    this.selectedActorId.set(null);
    this.resetActorForm();
    this.actorMessage.set("");
    this.actorError.set("");
    this.isActorModalOpen.set(true);
  }

  protected closeActorModal(): void {
    this.isActorModalOpen.set(false);
  }

  protected createActor(): void {
    const payload = {
      username: this.actorForm.username.trim(),
      fullName: this.actorForm.fullName.trim(),
      role: this.actorForm.role.trim(),
      departmentId: this.actorForm.departmentId || undefined,
    } as const;

    if (!payload.username || !payload.fullName || !payload.role) {
      this.actorError.set("Username, full name va role la bat buoc.");
      return;
    }

    this.portalDataService.createActor(payload as any).subscribe({
      next: () => {
        this.actorMessage.set("Da tao tai khoan noi bo moi.");
        this.actorError.set("");
        this.resetActorForm();
        this.closeActorModal();
        this.portalDataService.getActors().subscribe({
          next: (items) => {
            const map = new Map<string, ActorItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.actors.set(deduped);
            this.actorTotalCount.set(deduped.length);
          },
          error: () => this.actors.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.actorError.set(
          this.extractHttpErrorMessage(error, "Khong the tao tai khoan."),
        );
        this.actorMessage.set("");
      },
    });
  }

  protected saveActor(): void {
    const id = this.selectedActorId();
    if (!id) {
      this.actorError.set("Ban can chon mot tai khoan de cap nhat.");
      return;
    }

    const payload = {
      username: this.actorForm.username.trim(),
      fullName: this.actorForm.fullName.trim(),
      role: this.actorForm.role.trim(),
      departmentId: this.actorForm.departmentId || undefined,
    } as const;

    if (!payload.username || !payload.fullName || !payload.role) {
      this.actorError.set("Username, full name va role la bat buoc.");
      return;
    }

    this.portalDataService.updateActor(id, payload as any).subscribe({
      next: () => {
        this.actorMessage.set("Cap nhat tai khoan thanh cong.");
        this.actorError.set("");
        this.closeActorModal();
        this.portalDataService.getActors().subscribe({
          next: (items) => {
            const map = new Map<string, ActorItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.actors.set(deduped);
            this.actorTotalCount.set(deduped.length);
          },
          error: () => this.actors.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        // Reload and check
        this.portalDataService.getActors().subscribe({
          next: (items) => this.actors.set(items),
          error: () => this.actors.set([]),
        });

        setTimeout(() => {
          const updated = this.actors().find((a) => a.id === id);
          if (
            updated &&
            updated.username === payload.username &&
            updated.fullName === payload.fullName &&
            updated.role === payload.role &&
            (updated.departmentId ?? "") === (payload.departmentId ?? "")
          ) {
            this.actorMessage.set("Cap nhat tai khoan thanh cong.");
            this.actorError.set("");
            this.closeActorModal();
          } else {
            this.actorError.set(
              this.extractHttpErrorMessage(
                error,
                "Khong the cap nhat tai khoan.",
              ),
            );
            this.actorMessage.set("");
          }
        }, 700);
      },
    });
  }

  protected deleteSelectedActor(): void {
    const id = this.selectedActorId();
    if (!id) {
      this.actorError.set("Ban can chon mot tai khoan de xoa.");
      return;
    }

    this.portalDataService.deleteActor(id).subscribe({
      next: () => {
        this.actorMessage.set("Da xoa tai khoan.");
        this.actorError.set("");
        this.selectedActorId.set(null);
        this.resetActorForm();
        this.closeActorModal();
        this.portalDataService.getActors().subscribe({
          next: (items) => {
            const map = new Map<string, ActorItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.actors.set(deduped);
            this.actorTotalCount.set(deduped.length);
          },
          error: () => this.actors.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.portalDataService.getActors().subscribe({
          next: (items) => this.actors.set(items),
          error: () => this.actors.set([]),
        });

        setTimeout(() => {
          const stillExists = this.actors().some((a) => a.id === id);
          if (!stillExists) {
            this.actorMessage.set("Da xoa tai khoan.");
            this.actorError.set("");
            this.selectedActorId.set(null);
            this.resetActorForm();
            this.closeActorModal();
          } else {
            this.actorError.set(
              this.extractHttpErrorMessage(error, "Khong the xoa tai khoan."),
            );
            this.actorMessage.set("");
          }
        }, 700);
      },
    });
  }

  private resetActorForm(): void {
    this.actorForm.username = "";
    this.actorForm.fullName = "";
    this.actorForm.role = "";
    this.actorForm.departmentId = "";
  }

  protected clearDepartmentSelection(): void {
    this.selectedDepartmentId.set(null);
    this.resetDepartmentForm();
    this.departmentMessage.set("");
    this.departmentError.set("");
    this.isDepartmentModalOpen.set(true);
  }

  protected closeDepartmentModal(): void {
    this.isDepartmentModalOpen.set(false);
  }

  protected createDepartment(): void {
    const payload = {
      name: this.departmentForm.name.trim(),
      description: this.departmentForm.description.trim(),
    };
    if (!payload.name) {
      this.departmentError.set("Name la bat buoc.");
      return;
    }

    this.portalDataService.createDepartment(payload).subscribe({
      next: () => {
        this.departmentMessage.set("Da tao phong ban moi.");
        this.departmentError.set("");
        this.resetDepartmentForm();
        this.closeDepartmentModal();
        this.portalDataService.getDepartments().subscribe({
          next: (items) => {
            const map = new Map<string, DepartmentItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.departments.set(deduped);
            this.departmentTotalCount.set(deduped.length);
          },
          error: () => this.departments.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.departmentError.set(
          this.extractHttpErrorMessage(error, "Khong the tao phong ban."),
        );
        this.departmentMessage.set("");
      },
    });
  }

  protected saveDepartment(): void {
    const id = this.selectedDepartmentId();
    if (!id) {
      this.departmentError.set("Ban can chon mot phong ban de cap nhat.");
      return;
    }

    const payload = {
      name: this.departmentForm.name.trim(),
      description: this.departmentForm.description.trim(),
    };
    if (!payload.name) {
      this.departmentError.set("Name la bat buoc.");
      return;
    }

    this.portalDataService.updateDepartment(id, payload).subscribe({
      next: () => {
        this.departmentMessage.set("Cap nhat phong ban thanh cong.");
        this.departmentError.set("");
        this.closeDepartmentModal();
        this.portalDataService.getDepartments().subscribe({
          next: (items) => {
            const map = new Map<string, DepartmentItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.departments.set(deduped);
            this.departmentTotalCount.set(deduped.length);
          },
          error: () => this.departments.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.portalDataService.getDepartments().subscribe({
          next: (items) => this.departments.set(items),
          error: () => this.departments.set([]),
        });

        setTimeout(() => {
          const updated = this.departments().find((d) => d.id === id);
          if (
            updated &&
            updated.name === payload.name &&
            (updated.description ?? "") === (payload.description ?? "")
          ) {
            this.departmentMessage.set("Cap nhat phong ban thanh cong.");
            this.departmentError.set("");
            this.closeDepartmentModal();
          } else {
            this.departmentError.set(
              this.extractHttpErrorMessage(
                error,
                "Khong the cap nhat phong ban.",
              ),
            );
            this.departmentMessage.set("");
          }
        }, 700);
      },
    });
  }

  protected deleteSelectedDepartment(): void {
    const id = this.selectedDepartmentId();
    if (!id) {
      this.departmentError.set("Ban can chon mot phong ban de xoa.");
      return;
    }

    this.portalDataService.deleteDepartment(id).subscribe({
      next: () => {
        this.departmentMessage.set("Da xoa phong ban.");
        this.departmentError.set("");
        this.selectedDepartmentId.set(null);
        this.resetDepartmentForm();
        this.closeDepartmentModal();
        this.portalDataService.getDepartments().subscribe({
          next: (items) => {
            const map = new Map<string, DepartmentItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.departments.set(deduped);
            this.departmentTotalCount.set(deduped.length);
          },
          error: () => this.departments.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.portalDataService.getDepartments().subscribe({
          next: (items) => this.departments.set(items),
          error: () => this.departments.set([]),
        });

        setTimeout(() => {
          const stillExists = this.departments().some((d) => d.id === id);
          if (!stillExists) {
            this.departmentMessage.set("Da xoa phong ban.");
            this.departmentError.set("");
            this.selectedDepartmentId.set(null);
            this.resetDepartmentForm();
            this.closeDepartmentModal();
          } else {
            this.departmentError.set(
              this.extractHttpErrorMessage(error, "Khong the xoa phong ban."),
            );
            this.departmentMessage.set("");
          }
        }, 700);
      },
    });
  }

  private resetDepartmentForm(): void {
    this.departmentForm.name = "";
    this.departmentForm.description = "";
  }

  protected clearCategorySelection(): void {
    this.selectedCategoryId.set(null);
    this.resetCategoryForm();
    this.categoryMessage.set("");
    this.categoryError.set("");
    this.isCategoryModalOpen.set(true);
  }

  protected closeCategoryModal(): void {
    this.isCategoryModalOpen.set(false);
  }

  protected createCategory(): void {
    const payload = {
      name: this.categoryForm.name.trim(),
      slug: this.categoryForm.slug.trim(),
    };
    if (!payload.name || !payload.slug) {
      this.categoryError.set("Name va slug la bat buoc.");
      return;
    }

    this.portalDataService.createCategory(payload).subscribe({
      next: () => {
        this.categoryMessage.set("Da tao danh muc moi.");
        this.categoryError.set("");
        this.resetCategoryForm();
        this.closeCategoryModal();
        this.portalDataService.getCategories().subscribe({
          next: (items) => {
            const map = new Map<string, CategoryItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.categories.set(deduped);
            this.categoryTotalCount.set(deduped.length);
          },
          error: () => this.categories.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.categoryError.set(
          this.extractHttpErrorMessage(error, "Khong the tao danh muc."),
        );
        this.categoryMessage.set("");
      },
    });
  }

  protected saveCategory(): void {
    const id = this.selectedCategoryId();
    if (!id) {
      this.categoryError.set("Ban can chon mot danh muc de cap nhat.");
      return;
    }

    const payload = {
      name: this.categoryForm.name.trim(),
      slug: this.categoryForm.slug.trim(),
    };
    if (!payload.name || !payload.slug) {
      this.categoryError.set("Name va slug la bat buoc.");
      return;
    }

    this.portalDataService.updateCategory(id, payload).subscribe({
      next: () => {
        this.categoryMessage.set("Cap nhat danh muc thanh cong.");
        this.categoryError.set("");
        this.closeCategoryModal();
        this.portalDataService.getCategories().subscribe({
          next: (items) => {
            const map = new Map<string, CategoryItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.categories.set(deduped);
            this.categoryTotalCount.set(deduped.length);
          },
          error: () => this.categories.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        // Reload and check if updated
        this.portalDataService.getCategories().subscribe({
          next: (items) => this.categories.set(items),
          error: () => this.categories.set([]),
        });

        setTimeout(() => {
          const updated = this.categories().find((c) => c.id === id);
          if (
            updated &&
            updated.name === payload.name &&
            updated.slug === payload.slug
          ) {
            this.categoryMessage.set("Cap nhat danh muc thanh cong.");
            this.categoryError.set("");
            this.closeCategoryModal();
          } else {
            this.categoryError.set(
              this.extractHttpErrorMessage(
                error,
                "Khong the cap nhat danh muc.",
              ),
            );
            this.categoryMessage.set("");
          }
        }, 700);
      },
    });
  }

  protected deleteSelectedCategory(): void {
    const id = this.selectedCategoryId();
    if (!id) {
      this.categoryError.set("Ban can chon mot danh muc de xoa.");
      return;
    }

    this.portalDataService.deleteCategory(id).subscribe({
      next: () => {
        this.categoryMessage.set("Da xoa danh muc.");
        this.categoryError.set("");
        this.selectedCategoryId.set(null);
        this.resetCategoryForm();
        this.closeCategoryModal();
        this.portalDataService.getCategories().subscribe({
          next: (items) => {
            const map = new Map<string, CategoryItem>();
            for (const it of items || []) {
              if (it.id) map.set(it.id, it);
            }
            const deduped = Array.from(map.values());
            this.categories.set(deduped);
            this.categoryTotalCount.set(deduped.length);
          },
          error: () => this.categories.set([]),
        });
      },
      error: (error: HttpErrorResponse) => {
        this.portalDataService.getCategories().subscribe({
          next: (items) => this.categories.set(items),
          error: () => this.categories.set([]),
        });

        setTimeout(() => {
          const stillExists = this.categories().some((c) => c.id === id);
          if (!stillExists) {
            this.categoryMessage.set("Da xoa danh muc.");
            this.categoryError.set("");
            this.selectedCategoryId.set(null);
            this.resetCategoryForm();
            this.closeCategoryModal();
          } else {
            this.categoryError.set(
              this.extractHttpErrorMessage(error, "Khong the xoa danh muc."),
            );
            this.categoryMessage.set("");
          }
        }, 700);
      },
    });
  }

  private resetCategoryForm(): void {
    this.categoryForm.name = "";
    this.categoryForm.slug = "";
  }

  protected clearFaqSelection(): void {
    this.selectedFaqId.set(null);
    this.resetFaqForm();
    this.faqMessage.set("");
    this.faqError.set("");
    this.isFaqModalOpen.set(true);
  }

  protected closeFaqModal(): void {
    this.isFaqModalOpen.set(false);
  }

  protected saveDocumentMetadata(): void {
    const current = this.currentDocument();
    if (!current?.parentFileId) {
      this.documentError.set("Ban can chon mot tai lieu de cap nhat.");
      return;
    }

    if (!this.documentForm.title.trim()) {
      this.documentError.set("Tieu de tai lieu la bat buoc.");
      return;
    }

    const payload: UpdateDocumentPayload = {
      title: this.documentForm.title.trim(),
      departmentId: this.documentForm.departmentId || undefined,
      categoryId: this.documentForm.categoryId || undefined,
    };

    this.portalDataService
      .updateDocument(current.parentFileId, payload)
      .subscribe({
        next: () => {
          this.documentMessage.set("Cap nhat tai lieu thanh cong.");
          this.documentError.set("");
          this.closeDocumentModal();
          this.loadDocuments();
        },
        error: (error: HttpErrorResponse) => {
          this.documentError.set(
            this.extractHttpErrorMessage(error, "Khong the cap nhat tai lieu."),
          );
          this.documentMessage.set("");
        },
      });
  }

  protected chunkDocument(): void {
    const current = this.currentDocument();
    if (!current?.parentFileId) {
      this.documentError.set("Ban can chon mot tai lieu de tach chunk.");
      return;
    }

    this.documentMessage.set("Đang tách file... Vui lòng chờ đợi.");
    this.documentError.set("");
    this.isChunkingDocument.set(true);

    this.portalDataService
      .processDocumentChunks(current.parentFileId)
      .subscribe({
        next: () => {
          this.documentMessage.set(
            "Đã tách file thành công và lưu chunk vào database.",
          );
          this.documentError.set("");
          this.isChunkingDocument.set(false);
          this.loadDocuments();
        },
        error: (error: HttpErrorResponse) => {
          this.documentError.set(
            this.extractHttpErrorMessage(
              error,
              "Khong the tach file thanh chunk.",
            ),
          );
          this.documentMessage.set("");
          this.isChunkingDocument.set(false);
        },
      });
  }

  protected uploadDocument(): void {
    if (!this.selectedFile && !this.documentForm.fileLink.trim()) {
      this.documentError.set(
        "Ban can chon file de tai len hoac cung cap duong link toi file.",
      );
      return;
    }

    if (
      !this.documentForm.title.trim() ||
      !this.documentForm.departmentId ||
      !this.documentForm.categoryId
    ) {
      this.documentError.set("Can nhap du tieu de, phong ban va danh muc.");
      return;
    }

    if (this.documentForm.fileLink.trim()) {
      this.portalDataService
        .uploadDocumentLink({
          link: this.documentForm.fileLink.trim(),
          title: this.documentForm.title.trim(),
          departmentId: this.documentForm.departmentId,
          categoryId: this.documentForm.categoryId,
        })
        .subscribe({
          next: () => {
            this.documentMessage.set(
              "Tai lieu tu link da duoc them thanh cong.",
            );
            this.documentError.set("");
            this.documentForm.fileLink = "";
            this.documentForm.title = "";
            this.closeDocumentModal();
            this.loadDocuments();
          },
          error: (error: HttpErrorResponse) => {
            this.documentError.set(
              this.extractHttpErrorMessage(
                error,
                "Khong the them tai lieu tu link.",
              ),
            );
            this.documentMessage.set("");
          },
        });
    } else if (this.selectedFile) {
      this.portalDataService
        .uploadDocument({
          file: this.selectedFile,
          title: this.documentForm.title.trim(),
          departmentId: this.documentForm.departmentId,
          categoryId: this.documentForm.categoryId,
        })
        .subscribe({
          next: () => {
            this.documentMessage.set("Tai lieu da duoc tai len thanh cong.");
            this.documentError.set("");
            this.selectedFile = null;
            this.resetDocumentFilePicker();
            this.documentForm.title = "";
            this.closeDocumentModal();
            this.loadDocuments();
          },
          error: (error: HttpErrorResponse) => {
            this.documentError.set(
              this.extractHttpErrorMessage(
                error,
                "Khong the tai len tai lieu.",
              ),
            );
            this.documentMessage.set("");
          },
        });
    }
  }

  protected deleteSelectedDocument(): void {
    const current = this.currentDocument();
    if (!current?.parentFileId) {
      this.documentError.set("Ban can chon mot tai lieu de xoa.");
      return;
    }

    this.portalDataService.deleteDocument(current.parentFileId).subscribe({
      next: () => {
        this.documentMessage.set("Da xoa tai lieu.");
        this.documentError.set("");
        this.selectedDocumentId.set(null);
        this.documentForm.title = "";
        this.documentForm.departmentId = "";
        this.documentForm.categoryId = "";
        this.documentForm.fileLink = "";
        this.selectedFile = null;
        this.resetDocumentFilePicker();
        this.closeDocumentModal();
        this.loadDocuments();
      },
      error: (error: HttpErrorResponse) => {
        // Backend sometimes returns an error (e.g. file-not-found) even though
        // the document is removed from the database. Re-load documents and
        // check whether the item still exists; if not, treat as success.
        this.loadDocuments();

        setTimeout(() => {
          const stillExists = this.documents().some(
            (d) => d.parentFileId === current.parentFileId,
          );

          if (!stillExists) {
            this.documentMessage.set("Da xoa tai lieu.");
            this.documentError.set("");
            this.selectedDocumentId.set(null);
            this.documentForm.title = "";
            this.documentForm.departmentId = "";
            this.documentForm.categoryId = "";
            this.documentForm.fileLink = "";
            this.selectedFile = null;
            this.resetDocumentFilePicker();
            this.closeDocumentModal();
          } else {
            this.documentError.set(
              this.extractHttpErrorMessage(error, "Khong the xoa tai lieu."),
            );
            this.documentMessage.set("");
          }
        }, 700);
      },
    });
  }

  protected createFaq(): void {
    const payload = this.buildFaqPayload();
    if (!payload) {
      return;
    }

    this.portalDataService.createFaq(payload).subscribe({
      next: () => {
        this.faqMessage.set("Da tao FAQ moi.");
        this.faqError.set("");
        this.resetFaqForm();
        this.loadFaqs();
      },
      error: () => {
        this.faqError.set("Khong the tao FAQ.");
        this.faqMessage.set("");
      },
    });
  }

  protected saveFaq(): void {
    const current = this.currentFaq();
    if (!current?.id) {
      this.faqError.set("Ban can chon mot FAQ de cap nhat.");
      return;
    }

    const payload = this.buildFaqPayload();
    if (!payload) {
      return;
    }

    this.portalDataService.updateFaq(current.id, payload).subscribe({
      next: () => {
        this.faqMessage.set("Cap nhat FAQ thanh cong.");
        this.faqError.set("");
        this.closeFaqModal();
        this.loadFaqs();
      },
      error: (error: HttpErrorResponse) => {
        // Backend may return an error although the update succeeded.
        // Reload faqs and check whether the record was updated; if yes,
        // treat it as success to avoid confusing the user.
        this.loadFaqs();

        setTimeout(() => {
          const updated = this.faqs().find((f) => f.id === current.id);

          if (
            updated &&
            updated.question === payload.question &&
            updated.answer === payload.answer &&
            (updated.departmentId ?? "") === (payload.departmentId ?? "") &&
            (updated.categoryId ?? "") === (payload.categoryId ?? "")
          ) {
            this.faqMessage.set("Cap nhat FAQ thanh cong.");
            this.faqError.set("");
            this.closeFaqModal();
          } else {
            this.faqError.set(
              this.extractHttpErrorMessage(error, "Khong the cap nhat FAQ."),
            );
            this.faqMessage.set("");
          }
        }, 700);
      },
    });
  }

  protected deleteSelectedFaq(): void {
    const current = this.currentFaq();
    if (!current?.id) {
      this.faqError.set("Ban can chon mot FAQ de xoa.");
      return;
    }

    this.portalDataService.deleteFaq(current.id).subscribe({
      next: () => {
        this.faqMessage.set("Da xoa FAQ.");
        this.faqError.set("");
        this.selectedFaqId.set(null);
        this.resetFaqForm();
        this.closeFaqModal();
        this.loadFaqs();
      },
      error: (error: HttpErrorResponse) => {
        // Backend may return an error (e.g. file-not-found) even though the
        // FAQ record was removed. Reload faqs and check if the item still
        // exists; if not, treat as successful deletion.
        this.loadFaqs();

        setTimeout(() => {
          const stillExists = this.faqs().some((f) => f.id === current.id);

          if (!stillExists) {
            this.faqMessage.set("Da xoa FAQ.");
            this.faqError.set("");
            this.selectedFaqId.set(null);
            this.resetFaqForm();
            this.closeFaqModal();
          } else {
            this.faqError.set(
              this.extractHttpErrorMessage(
                error as HttpErrorResponse,
                "Khong the xoa FAQ.",
              ),
            );
            this.faqMessage.set("");
          }
        }, 700);
      },
    });
  }

  private loadDashboard(): void {
    this.loadDocuments();
    this.loadFaqs();

    this.portalDataService.getCategories().subscribe({
      next: (items) => {
        const map = new Map<string, CategoryItem>();
        for (const it of items || []) {
          if (it.id) map.set(it.id, it);
        }
        const deduped = Array.from(map.values());
        this.categories.set(deduped);
        this.categoryTotalCount.set(deduped.length);
      },
      error: () => this.categories.set([]),
    });

    this.portalDataService.getDepartments().subscribe({
      next: (items) => {
        const map = new Map<string, DepartmentItem>();
        for (const it of items || []) {
          if (it.id) map.set(it.id, it);
        }
        const deduped = Array.from(map.values());
        this.departments.set(deduped);
        this.departmentTotalCount.set(deduped.length);
      },
      error: () => this.departments.set([]),
    });

    this.loadSearchLogs();

    this.portalDataService.getSearchLogSummary().subscribe({
      next: (summary) => this.searchSummary.set(summary),
      error: () =>
        this.searchSummary.set({
          total: 0,
          ai: 0,
          faq: 0,
          fallback: 0,
          noData: 0,
          error: 0,
        }),
    });

    if (this.isAdminView()) {
      this.portalDataService.getActors().subscribe({
        next: (items) => {
          const map = new Map<string, ActorItem>();
          for (const it of items || []) {
            if (it.id) map.set(it.id, it);
          }
          const deduped = Array.from(map.values());
          this.actors.set(deduped);
          this.actorTotalCount.set(deduped.length);
        },
        error: () => this.actors.set([]),
      });
    }
  }

  protected searchDocuments(): void {
    this.documentCurrentPage.set(1);
    this.loadDocuments();
  }

  protected searchFaqs(): void {
    this.loadFaqs();
  }

  protected changeDocumentPage(delta: number): void {
    const newPage = this.documentCurrentPage() + delta;
    if (newPage >= 1 && newPage <= this.documentTotalPages()) {
      this.documentCurrentPage.set(newPage);
      this.loadDocuments();
    }
  }

  protected searchLogsByFilter(): void {
    this.searchLogCurrentPage.set(1);
    this.loadSearchLogs(1);
  }

  protected clearSearchLogFilters(): void {
    this.searchLogQuery.set("");
    this.searchLogSource.set(null);
    this.searchLogStart.set("");
    this.searchLogEnd.set("");
    this.searchLogCurrentPage.set(1);
    this.loadSearchLogs(1);
  }

  protected changeSearchLogPage(delta: number): void {
    const newPage = this.searchLogCurrentPage() + delta;
    if (newPage >= 1 && newPage <= this.searchLogTotalPages()) {
      this.searchLogCurrentPage.set(newPage);
      this.loadSearchLogs(newPage);
    }
  }

  private loadDocuments(): void {
    this.portalDataService
      .getDocuments({
        Page: this.documentCurrentPage(),
        PageSize: 12,
        Keyword: this.documentSearchQuery(),
      })
      .subscribe({
        next: (response) => {
          const items: DocumentItem[] = (response as any).items || [];
          const map = new Map<string, DocumentItem>();
          for (const it of items) {
            if (it.parentFileId) map.set(it.parentFileId, it);
          }
          const deduped = Array.from(map.values());
          this.documents.set(deduped);

          const serverTotal =
            (response as any).totalCount ||
            (response as any).totalItems ||
            (response as any).total ||
            0;
          this.documentTotalCount.set(serverTotal || deduped.length);
          this.documentTotalPages.set((response as any).totalPages || 1);
        },
        error: () => this.documents.set([]),
      });
  }

  private loadSearchLogs(page = 1): void {
    this.portalDataService
      .getSearchLogsPage(page, 10, {
        query: this.searchLogQuery(),
        source: this.searchLogSource() ?? undefined,
        startDate: this.searchLogStart() || undefined,
        endDate: this.searchLogEnd() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.searchLogs.set(response.items || []);
          this.searchLogCurrentPage.set(response.page || 1);
          this.searchLogTotalPages.set(response.totalPages || 1);
          this.searchLogTotalCount.set(response.totalItems || 0);
        },
        error: () => {
          this.searchLogs.set([]);
          this.searchLogCurrentPage.set(1);
          this.searchLogTotalPages.set(1);
          this.searchLogTotalCount.set(0);
        },
      });
  }

  private loadFaqs(): void {
    const params: Record<string, string | number> = {};
    const q = this.faqSearchQuery().trim();
    if (q) params["Keyword"] = q;

    this.portalDataService.getFaqs(params).subscribe({
      next: (items) => {
        const map = new Map<string, FaqItem>();
        for (const it of items || []) {
          if (it.id) map.set(it.id, it);
        }
        const deduped = Array.from(map.values());
        this.faqs.set(deduped);
        this.faqTotalCount.set(deduped.length);
      },
      error: () => this.faqs.set([]),
    });
  }

  private buildFaqPayload(): FaqPayload | null {
    if (!this.faqForm.question.trim() || !this.faqForm.answer.trim()) {
      this.faqError.set("Question va Answer la bat buoc.");
      return null;
    }

    if (!this.faqForm.departmentId || !this.faqForm.categoryId) {
      this.faqError.set("Can chon phong ban va danh muc cho FAQ.");
      return null;
    }

    return {
      question: this.faqForm.question.trim(),
      answer: this.faqForm.answer.trim(),
      departmentId: this.faqForm.departmentId,
      categoryId: this.faqForm.categoryId,
    };
  }

  private resetFaqForm(): void {
    this.faqForm.question = "";
    this.faqForm.answer = "";
    this.faqForm.departmentId = "";
    this.faqForm.categoryId = "";
  }

  private resetDocumentFilePicker(): void {
    this.uploadFileName.set("Chua chon file");
    if (this.documentFileInput) {
      this.documentFileInput.nativeElement.value = "";
    }
  }

  private extractHttpErrorMessage(
    error: HttpErrorResponse,
    fallback: string,
  ): string {
    const payload = error.error;

    if (typeof payload === "string" && payload.trim()) {
      return payload.trim();
    }

    if (payload && typeof payload === "object") {
      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message.trim();
      }

      if (typeof payload.title === "string" && payload.title.trim()) {
        return payload.title.trim();
      }

      if (payload.errors && typeof payload.errors === "object") {
        const firstError = Object.values(payload.errors)
          .flat()
          .find((item) => typeof item === "string" && item.trim());

        if (typeof firstError === "string") {
          return firstError.trim();
        }
      }
    }

    return fallback;
  }
}
