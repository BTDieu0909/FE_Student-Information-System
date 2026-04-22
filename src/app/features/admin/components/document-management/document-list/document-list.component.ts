import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentItem } from '../../../../../core/services/portal-data.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Input() documents: DocumentItem[] = [];
  @Input() totalCount = 0;
  @Input() totalPages = 1;
  @Input() currentPage = 1;
  @Input() searchQuery = '';
  @Input() selectedDocumentId: string | null = null;

  @Output() search = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() select = new EventEmitter<DocumentItem>();
  @Output() addNew = new EventEmitter<void>();

  protected onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  protected onPageChange(delta: number): void {
    this.pageChange.emit(delta);
  }

  protected onSelect(item: DocumentItem): void {
    this.select.emit(item);
  }

  protected onAddNew(): void {
    this.addNew.emit();
  }
}
