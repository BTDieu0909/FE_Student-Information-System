import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { DocumentItem, CategoryItem, DepartmentItem } from '../../../../core/services/portal-data.service';
import { AdminService } from '../../services/admin.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentModalComponent } from './document-modal/document-modal.component';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [CommonModule, DocumentListComponent, DocumentModalComponent],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.css'
})
export class DocumentManagementComponent {
  @Input() departments: DepartmentItem[] = [];
  @Input() categories: CategoryItem[] = [];
  
  private readonly adminService = inject(AdminService);
  
  protected readonly documents = signal<DocumentItem[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly currentPage = signal(1);
  protected readonly searchQuery = signal('');
  
  protected readonly isModalOpen = signal(false);
  protected readonly selectedDocument = signal<DocumentItem | null>(null);

  constructor() {
    this.loadDocuments();
  }

  protected loadDocuments(page = 1): void {
    this.currentPage.set(page);
    
    this.adminService.getDocuments({ 
      Page: page, 
      PageSize: 10,
      Keyword: this.searchQuery(),
      _t: new Date().getTime()
    }).subscribe({
      next: (res) => {
        // Force a new array reference and update metadata
        this.documents.set([...res.items]);
        this.totalPages.set(res.pagination.totalPages);
        this.totalCount.set(res.pagination.totalItems);
        
        // If current page is empty and not on page 1, go back
        if (res.items.length === 0 && page > 1) {
          this.loadDocuments(page - 1);
        }
      },
      error: () => this.documents.set([])
    });
  }

  protected onSaved(): void {
    // Thêm một khoảng trễ nhỏ để đảm bảo Backend đã xử lý xong DB
    // và tránh xung đột với lúc Modal đang đóng.
    setTimeout(() => {
      this.selectedDocument.set(null);
      this.loadDocuments(this.currentPage());
    }, 500);
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.loadDocuments(1);
  }

  protected onPageChange(delta: number): void {
    const next = this.currentPage() + delta;
    if (next >= 1 && next <= this.totalPages()) {
      this.loadDocuments(next);
    }
  }

  protected onSelect(item: DocumentItem): void {
    this.selectedDocument.set(item);
    this.isModalOpen.set(true);
  }

  protected onAddNew(): void {
    this.selectedDocument.set(null);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }
}
