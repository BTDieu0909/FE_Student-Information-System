import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentItem, PortalDataService } from '../../services/portal-data.service';

@Component({
  selector: 'app-documents-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.css'
})
export class DocumentsPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly keyword = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly items = signal<DocumentItem[]>([]);

  constructor() {
    this.search();
  }

  search(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.portalDataService.getDocuments({ Page: 1, PageSize: 12, Keyword: this.keyword() }).subscribe({
      next: (response) => {
        this.items.set(response.items ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Khong the tai kho tai lieu.');
        this.loading.set(false);
      }
    });
  }
}
