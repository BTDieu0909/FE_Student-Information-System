import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  ActorItem,
  CategoryItem,
  DepartmentItem,
  DocumentItem,
  FaqPayload,
  FaqItem,
  PortalDataService,
  SearchLogItem,
  SearchLogSummary,
  UpdateDocumentPayload
} from '../../services/portal-data.service';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  @ViewChild('documentFileInput') private documentFileInput?: ElementRef<HTMLInputElement>;
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly portalDataService = inject(PortalDataService);
  protected readonly sections = signal<{ key: string; label: string }[]>([]);

  protected readonly documents = signal<DocumentItem[]>([]);
  protected readonly faqs = signal<FaqItem[]>([]);
  protected readonly categories = signal<CategoryItem[]>([]);
  protected readonly departments = signal<DepartmentItem[]>([]);
  protected readonly searchLogs = signal<SearchLogItem[]>([]);
  protected readonly actors = signal<ActorItem[]>([]);
  protected readonly activeSection = signal<string>('documents');
  protected readonly selectedDocumentId = signal<string | null>(null);
  protected readonly selectedFaqId = signal<string | null>(null);
  protected readonly documentMessage = signal('');
  protected readonly documentError = signal('');
  protected readonly faqMessage = signal('');
  protected readonly faqError = signal('');
  protected readonly uploadFileName = signal('Chua chon file');

  protected readonly documentSearchQuery = signal('');
  protected readonly documentCurrentPage = signal(1);
  protected readonly documentTotalPages = signal(1);
  protected readonly isDocumentModalOpen = signal(false);
  protected readonly isFaqModalOpen = signal(false);

  protected readonly searchSummary = signal<SearchLogSummary>({
    total: 0,
    ai: 0,
    faq: 0,
    fallback: 0,
    noData: 0,
    error: 0
  });

  protected readonly documentForm = {
    title: '',
    departmentId: '',
    categoryId: '',
    fileLink: ''
  };

  protected readonly faqForm = {
    question: '',
    answer: '',
    departmentId: '',
    categoryId: ''
  };
  private selectedFile: File | null = null;

  constructor() {
    this.sections.set(this.buildSections());
    this.loadDashboard();
  }

  protected isAdminView(): boolean {
    return this.route.snapshot.data['roleView'] === 'admin' && this.authService.getRole() === 'admin';
  }

  protected pageTitle(): string {
    return this.isAdminView() ? 'Khu vuc quan tri admin' : 'Khu vuc staff';
  }

  protected userDisplayName(): string {
    return this.authService.currentUser()?.fullName || this.authService.currentUser()?.username || 'Nguoi dung';
  }

  protected username(): string {
    return this.authService.currentUser()?.username || 'tai khoan';
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

    return this.documents().find((item) => item.parentFileId === parentFileId) ?? null;
  }

  protected currentDocumentFileName(): string {
    return this.currentDocument()?.fileName || 'Khong co file hien tai';
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
    return this.currentDocument()?.departmentId || '';
  }

  protected currentDocumentCategoryId(): string {
    return this.currentDocument()?.categoryId || '';
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
      { key: 'documents', label: 'Quan tri tai lieu' },
      { key: 'faqs', label: 'Quan tri FAQ' },
      { key: 'categories', label: 'Quan tri danh muc' },
      { key: 'departments', label: 'Quan tri phong ban' },
      { key: 'search-logs', label: 'Xem thong ke tra cuu' }
    ];

    if (this.isAdminView()) {
      items.push({ key: 'actors', label: 'Tai khoan noi bo admin' });
    }

    return items;
  }

  protected selectDocument(item: DocumentItem): void {
    this.selectedDocumentId.set(item.parentFileId ?? null);
    this.documentForm.title = item.title;
    this.documentForm.departmentId = item.departmentId ?? '';
    this.documentForm.categoryId = item.categoryId ?? '';
    this.selectedFile = null;
    this.documentForm.fileLink = '';
    this.resetDocumentFilePicker();
    this.documentMessage.set('');
    this.documentError.set('');
    this.isDocumentModalOpen.set(true);
  }

  protected clearDocumentSelection(): void {
    this.selectedDocumentId.set(null);
    this.documentForm.title = '';
    this.documentForm.departmentId = '';
    this.documentForm.categoryId = '';
    this.documentForm.fileLink = '';
    this.selectedFile = null;
    this.resetDocumentFilePicker();
    this.documentMessage.set('');
    this.documentError.set('');
    this.isDocumentModalOpen.set(true);
  }

  protected closeDocumentModal(): void {
    this.isDocumentModalOpen.set(false);
  }

  protected onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.uploadFileName.set(file?.name ?? 'Chua chon file');
    if (file) {
      this.documentForm.fileLink = ''; // Clear link when file is selected
    }
  }

  protected selectFaq(item: FaqItem): void {
    this.selectedFaqId.set(item.id ?? null);
    this.faqForm.question = item.question;
    this.faqForm.answer = item.answer;
    this.faqForm.departmentId = item.departmentId ?? '';
    this.faqForm.categoryId = item.categoryId ?? '';
    this.faqMessage.set('');
    this.faqError.set('');
    this.isFaqModalOpen.set(true);
  }

  protected clearFaqSelection(): void {
    this.selectedFaqId.set(null);
    this.resetFaqForm();
    this.faqMessage.set('');
    this.faqError.set('');
    this.isFaqModalOpen.set(true);
  }

  protected closeFaqModal(): void {
    this.isFaqModalOpen.set(false);
  }

  protected saveDocumentMetadata(): void {
    const current = this.currentDocument();
    if (!current?.parentFileId) {
      this.documentError.set('Ban can chon mot tai lieu de cap nhat.');
      return;
    }

    if (!this.documentForm.title.trim()) {
      this.documentError.set('Tieu de tai lieu la bat buoc.');
      return;
    }

    const payload: UpdateDocumentPayload = {
      title: this.documentForm.title.trim(),
      departmentId: this.documentForm.departmentId || undefined,
      categoryId: this.documentForm.categoryId || undefined
    };

    this.portalDataService.updateDocument(current.parentFileId, payload).subscribe({
      next: () => {
        this.documentMessage.set('Cap nhat tai lieu thanh cong.');
        this.documentError.set('');
        this.closeDocumentModal();
        this.loadDocuments();
      },
      error: (error: HttpErrorResponse) => {
        this.documentError.set(this.extractHttpErrorMessage(error, 'Khong the cap nhat tai lieu.'));
        this.documentMessage.set('');
      }
    });
  }

  protected uploadDocument(): void {
    if (!this.selectedFile && !this.documentForm.fileLink.trim()) {
      this.documentError.set('Ban can chon file de tai len hoac cung cap duong link toi file.');
      return;
    }

    if (!this.documentForm.title.trim() || !this.documentForm.departmentId || !this.documentForm.categoryId) {
      this.documentError.set('Can nhap du tieu de, phong ban va danh muc.');
      return;
    }

    if (this.documentForm.fileLink.trim()) {
      this.portalDataService.uploadDocumentLink({
        link: this.documentForm.fileLink.trim(),
        title: this.documentForm.title.trim(),
        departmentId: this.documentForm.departmentId,
        categoryId: this.documentForm.categoryId
      }).subscribe({
        next: () => {
          this.documentMessage.set('Tai lieu tu link da duoc them thanh cong.');
          this.documentError.set('');
          this.documentForm.fileLink = '';
          this.documentForm.title = '';
          this.closeDocumentModal();
          this.loadDocuments();
        },
        error: (error: HttpErrorResponse) => {
          this.documentError.set(this.extractHttpErrorMessage(error, 'Khong the them tai lieu tu link.'));
          this.documentMessage.set('');
        }
      });
    } else if (this.selectedFile) {
      this.portalDataService.uploadDocument({
        file: this.selectedFile,
        title: this.documentForm.title.trim(),
        departmentId: this.documentForm.departmentId,
        categoryId: this.documentForm.categoryId
      }).subscribe({
        next: () => {
          this.documentMessage.set('Tai lieu da duoc tai len thanh cong.');
          this.documentError.set('');
          this.selectedFile = null;
          this.resetDocumentFilePicker();
          this.documentForm.title = '';
          this.closeDocumentModal();
          this.loadDocuments();
        },
        error: (error: HttpErrorResponse) => {
          this.documentError.set(this.extractHttpErrorMessage(error, 'Khong the tai len tai lieu.'));
          this.documentMessage.set('');
        }
      });
    }
  }

  protected deleteSelectedDocument(): void {
    const current = this.currentDocument();
    if (!current?.parentFileId) {
      this.documentError.set('Ban can chon mot tai lieu de xoa.');
      return;
    }

    this.portalDataService.deleteDocument(current.parentFileId).subscribe({
      next: () => {
        this.documentMessage.set('Da xoa tai lieu.');
        this.documentError.set('');
        this.selectedDocumentId.set(null);
        this.documentForm.title = '';
        this.documentForm.departmentId = '';
        this.documentForm.categoryId = '';
        this.documentForm.fileLink = '';
        this.selectedFile = null;
        this.resetDocumentFilePicker();
        this.closeDocumentModal();
        this.loadDocuments();
      },
      error: (error: HttpErrorResponse) => {
        this.documentError.set(this.extractHttpErrorMessage(error, 'Khong the xoa tai lieu.'));
        this.documentMessage.set('');
      }
    });
  }

  protected createFaq(): void {
    const payload = this.buildFaqPayload();
    if (!payload) {
      return;
    }

    this.portalDataService.createFaq(payload).subscribe({
      next: () => {
        this.faqMessage.set('Da tao FAQ moi.');
        this.faqError.set('');
        this.resetFaqForm();
        this.loadFaqs();
      },
      error: () => {
        this.faqError.set('Khong the tao FAQ.');
        this.faqMessage.set('');
      }
    });
  }

  protected saveFaq(): void {
    const current = this.currentFaq();
    if (!current?.id) {
      this.faqError.set('Ban can chon mot FAQ de cap nhat.');
      return;
    }

    const payload = this.buildFaqPayload();
    if (!payload) {
      return;
    }

    this.portalDataService.updateFaq(current.id, payload).subscribe({
      next: () => {
        this.faqMessage.set('Cap nhat FAQ thanh cong.');
        this.faqError.set('');
        this.closeFaqModal();
        this.loadFaqs();
      },
      error: () => {
        this.faqError.set('Khong the cap nhat FAQ.');
        this.faqMessage.set('');
      }
    });
  }

  protected deleteSelectedFaq(): void {
    const current = this.currentFaq();
    if (!current?.id) {
      this.faqError.set('Ban can chon mot FAQ de xoa.');
      return;
    }

    this.portalDataService.deleteFaq(current.id).subscribe({
      next: () => {
        this.faqMessage.set('Da xoa FAQ.');
        this.faqError.set('');
        this.selectedFaqId.set(null);
        this.resetFaqForm();
        this.loadFaqs();
      },
      error: () => {
        this.faqError.set('Khong the xoa FAQ.');
        this.faqMessage.set('');
      }
    });
  }

  private loadDashboard(): void {
    this.loadDocuments();
    this.loadFaqs();

    this.portalDataService.getCategories().subscribe({
      next: (items) => this.categories.set(items),
      error: () => this.categories.set([])
    });

    this.portalDataService.getDepartments().subscribe({
      next: (items) => this.departments.set(items),
      error: () => this.departments.set([])
    });

    this.portalDataService.getSearchLogs(8).subscribe({
      next: (items) => this.searchLogs.set(items),
      error: () => this.searchLogs.set([])
    });

    this.portalDataService.getSearchLogSummary().subscribe({
      next: (summary) => this.searchSummary.set(summary),
      error: () =>
        this.searchSummary.set({
          total: 0,
          ai: 0,
          faq: 0,
          fallback: 0,
          noData: 0,
          error: 0
        })
    });

    if (this.isAdminView()) {
      this.portalDataService.getActors().subscribe({
        next: (items) => this.actors.set(items),
        error: () => this.actors.set([])
      });
    }
  }

  protected searchDocuments(): void {
    this.documentCurrentPage.set(1);
    this.loadDocuments();
  }

  protected changeDocumentPage(delta: number): void {
    const newPage = this.documentCurrentPage() + delta;
    if (newPage >= 1 && newPage <= this.documentTotalPages()) {
      this.documentCurrentPage.set(newPage);
      this.loadDocuments();
    }
  }

  private loadDocuments(): void {
    this.portalDataService.getDocuments({
      Page: this.documentCurrentPage(),
      PageSize: 12,
      Keyword: this.documentSearchQuery()
    }).subscribe({
      next: (response) => {
        this.documents.set(response.items);
        // Assuming response has a totalPages, otherwise just default to 1 since we don't know
        // Backend actually doesn't return totalPages according to the interface but let's safely set it to 1
        this.documentTotalPages.set((response as any).totalPages || 1);
      },
      error: () => this.documents.set([])
    });
  }

  private loadFaqs(): void {
    this.portalDataService.getFaqs().subscribe({
      next: (items) => {
        this.faqs.set(items);
      },
      error: () => this.faqs.set([])
    });
  }

  private buildFaqPayload(): FaqPayload | null {
    if (!this.faqForm.question.trim() || !this.faqForm.answer.trim()) {
      this.faqError.set('Question va Answer la bat buoc.');
      return null;
    }

    if (!this.faqForm.departmentId || !this.faqForm.categoryId) {
      this.faqError.set('Can chon phong ban va danh muc cho FAQ.');
      return null;
    }

    return {
      question: this.faqForm.question.trim(),
      answer: this.faqForm.answer.trim(),
      departmentId: this.faqForm.departmentId,
      categoryId: this.faqForm.categoryId
    };
  }

  private resetFaqForm(): void {
    this.faqForm.question = '';
    this.faqForm.answer = '';
    this.faqForm.departmentId = '';
    this.faqForm.categoryId = '';
  }

  private resetDocumentFilePicker(): void {
    this.uploadFileName.set('Chua chon file');
    if (this.documentFileInput) {
      this.documentFileInput.nativeElement.value = '';
    }
  }

  private extractHttpErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const payload = error.error;

    if (typeof payload === 'string' && payload.trim()) {
      return payload.trim();
    }

    if (payload && typeof payload === 'object') {
      if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message.trim();
      }

      if (typeof payload.title === 'string' && payload.title.trim()) {
        return payload.title.trim();
      }

      if (payload.errors && typeof payload.errors === 'object') {
        const firstError = Object.values(payload.errors)
          .flat()
          .find((item) => typeof item === 'string' && item.trim());

        if (typeof firstError === 'string') {
          return firstError.trim();
        }
      }
    }

    return fallback;
  }
}
