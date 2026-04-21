import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentItem, CategoryItem, DepartmentItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.css'
})
export class DocumentManagementComponent {
  @Input() departments: DepartmentItem[] = [];
  @Input() categories: CategoryItem[] = [];
  
  private readonly portalDataService = inject(PortalDataService);
  
  @ViewChild('documentFileInput') private documentFileInput?: ElementRef<HTMLInputElement>;
  
  protected readonly documents = signal<DocumentItem[]>([]);
  protected readonly documentTotalCount = signal(0);
  protected readonly documentSearchQuery = signal('');
  protected readonly documentCurrentPage = signal(1);
  protected readonly documentTotalPages = signal(1);
  protected readonly isDocumentModalOpen = signal(false);
  protected readonly isChunkingDocument = signal(false);
  protected readonly selectedDocumentId = signal<string | null>(null);
  protected readonly documentMessage = signal('');
  protected readonly documentError = signal('');
  protected readonly uploadFileName = signal('Chua chon file');
  
  protected readonly documentForm = {
    title: '',
    departmentId: '',
    categoryId: '',
    fileLink: ''
  };
  
  private selectedFile: File | null = null;

  constructor() {
    this.loadDocuments();
  }

  protected loadDocuments(): void {
    this.portalDataService.getDocuments({ 
      Page: this.documentCurrentPage(), 
      PageSize: 10,
      Query: this.documentSearchQuery()
    }).subscribe({
      next: (res) => {
        this.documents.set(res.items);
        this.documentTotalPages.set(res.pagination.totalPages);
        this.documentTotalCount.set(res.pagination.totalItems);
      },
      error: () => this.documents.set([])
    });
  }

  protected searchDocuments(): void {
    this.documentCurrentPage.set(1);
    this.loadDocuments();
  }

  protected changeDocumentPage(delta: number): void {
    const next = this.documentCurrentPage() + delta;
    if (next >= 1 && next <= this.documentTotalPages()) {
      this.documentCurrentPage.set(next);
      this.loadDocuments();
    }
  }

  protected currentDocument(): DocumentItem | null {
    const id = this.selectedDocumentId();
    return id ? (this.documents().find(d => d.parentFileId === id) ?? null) : null;
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
      this.documentForm.fileLink = '';
    }
  }

  private resetDocumentFilePicker(): void {
    if (this.documentFileInput) {
      this.documentFileInput.nativeElement.value = '';
    }
    this.uploadFileName.set('Chua chon file');
  }

  protected uploadDocument(): void {
    if (!this.documentForm.title) {
      this.documentError.set('Tieu de la bat buoc.');
      return;
    }

    if (this.documentForm.fileLink) {
        this.portalDataService.uploadDocumentLink({
            title: this.documentForm.title,
            departmentId: this.documentForm.departmentId,
            categoryId: this.documentForm.categoryId,
            link: this.documentForm.fileLink
        }).subscribe({
            next: () => {
                this.documentMessage.set('Da tai len lien ket tai lieu.');
                this.loadDocuments();
                setTimeout(() => this.closeDocumentModal(), 1500);
            },
            error: (err: HttpErrorResponse) => {
                this.documentError.set(err.error?.message || 'Khong the tai len lien ket.');
            }
        });
        return;
    }
    
    if (!this.selectedFile) {
        this.documentError.set('Vui long chon file hoac nhap lien ket.');
        return;
    }

    this.isChunkingDocument.set(true);
    this.portalDataService.uploadDocument({
      title: this.documentForm.title,
      departmentId: this.documentForm.departmentId,
      categoryId: this.documentForm.categoryId,
      file: this.selectedFile
    }).subscribe({
      next: () => {
        this.documentMessage.set('Da tai len tai lieu moi.');
        this.isChunkingDocument.set(false);
        this.loadDocuments();
        setTimeout(() => this.closeDocumentModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.documentError.set(err.error?.message || 'Khong the tai len tai lieu.');
        this.isChunkingDocument.set(false);
      }
    });
  }

  protected saveDocumentMetadata(): void {
    const id = this.selectedDocumentId();
    if (!id) return;

    this.portalDataService.updateDocument(id, {
      title: this.documentForm.title,
      departmentId: this.documentForm.departmentId,
      categoryId: this.documentForm.categoryId
    }).subscribe({
      next: () => {
        this.documentMessage.set('Da cap nhat thong tin tai lieu.');
        this.loadDocuments();
      },
      error: (err: HttpErrorResponse) => {
        this.documentError.set(err.error?.message || 'Khong the cap nhat.');
      }
    });
  }

  protected chunkDocument(): void {
    const id = this.selectedDocumentId();
    if (!id) return;

    this.isChunkingDocument.set(true);
    this.portalDataService.processDocumentChunks(id).subscribe({
      next: () => {
        this.documentMessage.set('Da tach file thanh cong.');
        this.isChunkingDocument.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.documentError.set(err.error?.message || 'Loi khi tach file.');
        this.isChunkingDocument.set(false);
      }
    });
  }

  protected deleteSelectedDocument(): void {
    const id = this.selectedDocumentId();
    if (!id || !confirm('Ban co chac muon xoa tai lieu nay?')) return;

    this.portalDataService.deleteDocument(id).subscribe({
      next: () => {
        this.documentMessage.set('Da xoa tai lieu.');
        this.loadDocuments();
        setTimeout(() => this.closeDocumentModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.documentError.set(err.error?.message || 'Khong the xoa.');
      }
    });
  }

  protected currentDocumentFileName(): string {
    return this.currentDocument()?.fileName || 'Khong co file hien tai';
  }

  protected isCurrentDocumentDepartmentMissing(): boolean {
    const current = this.currentDocument();
    return !!current?.departmentId && !this.departments.some(d => d.id === current.departmentId);
  }

  protected isCurrentDocumentCategoryMissing(): boolean {
    const current = this.currentDocument();
    return !!current?.categoryId && !this.categories.some(c => c.id === current.categoryId);
  }

  protected currentDocumentDepartmentId(): string {
    return this.currentDocument()?.departmentId || '';
  }

  protected currentDocumentCategoryId(): string {
    return this.currentDocument()?.categoryId || '';
  }
}
