import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-faq-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.css'
})
export class FaqPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly items = signal<FaqItem[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly keyword = signal('');

  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalCount = signal(0);
  readonly pageSize = 5;

  constructor() {
    this.search();
  }

  onKeywordChange(value: string): void {
    this.keyword.set(value);
  }

  onPageChange(delta: number): void {
    const next = this.currentPage() + delta;
    if (next >= 1 && next <= this.totalPages()) {
      this.currentPage.set(next);
      this.search(next);
    }
  }

  search(page: number = 1): void {
    this.currentPage.set(page);
    this.loading.set(true);
    this.errorMessage.set('');

    const params: Record<string, string | number> = {
      Page: page,
      PageSize: this.pageSize
    };

    if (this.keyword().trim()) {
      params['Keyword'] = this.keyword().trim();
    }

    this.portalDataService.getFaqs(params).subscribe({
      next: (response) => {
        this.items.set(response.items || []);
        this.totalPages.set(response.totalPages || 1);
        this.totalCount.set(response.totalItems || 0);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Khong the tai FAQ.');
        this.loading.set(false);
      }
    });
  }
}