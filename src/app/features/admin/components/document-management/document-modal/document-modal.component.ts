import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentItem, CategoryItem, DepartmentItem } from '../../../../../core/services/portal-data.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-document-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-modal.component.html',
  styleUrl: './document-modal.component.css'
})
export class DocumentModalComponent {
  @Input() departments: DepartmentItem[] = [];
  @Input() categories: CategoryItem[] = [];
  @Input() selectedDocument: DocumentItem | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly adminService = inject(AdminService);
  
  @ViewChild('documentFileInput') private documentFileInput?: ElementRef<HTMLInputElement>;
  
  protected readonly isChunking = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal('');
  protected readonly uploadFileName = signal('Chua chon file');
  
  protected readonly form = {
    title: '',
    departmentId: '',
    categoryId: '',
    fileLink: ''
  };
  
  private selectedFile: File | null = null;

  ngOnChanges(): void {
    if (this.selectedDocument) {
      this.form.title = this.selectedDocument.title;
      this.form.departmentId = this.selectedDocument.departmentId ?? '';
      this.form.categoryId = this.selectedDocument.categoryId ?? '';
    } else {
      this.form.title = '';
      this.form.departmentId = '';
      this.form.categoryId = '';
    }
    this.form.fileLink = '';
    this.selectedFile = null;
    this.message.set('');
    this.error.set('');
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.uploadFileName.set(file?.name ?? 'Chua chon file');
    if (file) {
      this.form.fileLink = '';
    }
  }

  protected upload(): void {
    if (!this.form.title) {
      this.error.set('Tieu de la bat buoc.');
      return;
    }

    if (this.form.fileLink) {
        this.adminService.uploadDocumentLink({
            title: this.form.title,
            departmentId: this.form.departmentId,
            categoryId: this.form.categoryId,
            link: this.form.fileLink
        }).subscribe({
            next: () => {
                this.message.set('Da tai len lien ket tai lieu.');
                this.saved.emit();
                setTimeout(() => this.onClose(), 1500);
            },
            error: (err: HttpErrorResponse) => {
                this.error.set(err.error?.message || 'Khong the tai len lien ket.');
            }
        });
        return;
    }
    
    if (!this.selectedFile) {
        this.error.set('Vui long chon file hoac nhap lien ket.');
        return;
    }

    this.isChunking.set(true);
    this.adminService.uploadDocument({
      title: this.form.title,
      departmentId: this.form.departmentId,
      categoryId: this.form.categoryId,
      file: this.selectedFile
    }).subscribe({
      next: () => {
        this.message.set('Da tai len tai lieu moi.');
        this.isChunking.set(false);
        this.saved.emit();
        setTimeout(() => this.onClose(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Khong the tai len tai lieu.');
        this.isChunking.set(false);
      }
    });
  }

  protected saveMetadata(): void {
    const id = this.selectedDocument?.parentFileId;
    if (!id) return;

    this.adminService.updateDocument(id, {
      title: this.form.title,
      departmentId: this.form.departmentId,
      categoryId: this.form.categoryId
    }).subscribe({
      next: () => {
        this.message.set('Da cap nhat thong tin tai lieu.');
        this.saved.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Khong the cap nhat.');
      }
    });
  }

  protected chunkDocument(): void {
    const id = this.selectedDocument?.parentFileId;
    if (!id) return;

    this.isChunking.set(true);
    this.adminService.processDocumentChunks(id).subscribe({
      next: () => {
        this.message.set('Da tach file thanh cong.');
        this.isChunking.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Loi khi tach file.');
        this.isChunking.set(false);
      }
    });
  }

  protected deleteDocument(): void {
    const id = this.selectedDocument?.parentFileId;
    if (!id || !confirm('Ban co chac muon xoa tai lieu nay?')) return;

    this.adminService.deleteDocument(id).subscribe({
      next: () => {
        this.message.set('Da xoa tai lieu.');
        this.saved.emit();
        setTimeout(() => this.onClose(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Khong the xoa.');
      }
    });
  }

  protected isDepartmentMissing(): boolean {
    return !!this.selectedDocument?.departmentId && !this.departments.some(d => d.id === this.selectedDocument?.departmentId);
  }

  protected isCategoryMissing(): boolean {
    return !!this.selectedDocument?.categoryId && !this.categories.some(c => c.id === this.selectedDocument?.categoryId);
  }
}
