import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchLogItem, SearchLogSummary, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-search-log-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-log-viewer.component.html',
  styleUrl: './search-log-viewer.component.css'
})
export class SearchLogViewerComponent {
  private readonly portalDataService = inject(PortalDataService);
  
  protected readonly searchLogs = signal<SearchLogItem[]>([]);
  protected readonly searchLogQuery = signal('');
  protected readonly searchLogSource = signal<string | null>(null);
  protected readonly searchLogStart = signal('');
  protected readonly searchLogEnd = signal('');
  protected readonly searchLogCurrentPage = signal(1);
  protected readonly searchLogTotalPages = signal(1);
  protected readonly searchLogTotalCount = signal(0);
  
  protected readonly searchSummary = signal<SearchLogSummary>({
    total: 0, ai: 0, faq: 0, fallback: 0, noData: 0, error: 0
  });

  constructor() {
    this.loadSearchLogs();
    this.loadSummary();
  }

  protected loadSummary(): void {
    this.portalDataService.getSearchLogSummary().subscribe({
      next: (summary) => this.searchSummary.set(summary),
      error: () => this.searchSummary.set({
        total: 0, ai: 0, faq: 0, fallback: 0, noData: 0, error: 0
      })
    });
  }

  protected loadSearchLogs(page = 1): void {
    this.portalDataService.getSearchLogsPage(page, 10, {
      query: this.searchLogQuery(),
      source: this.searchLogSource() ?? undefined,
      startDate: this.searchLogStart() || undefined,
      endDate: this.searchLogEnd() || undefined,
    }).subscribe({
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
      }
    });
  }

  protected searchLogsByFilter(): void {
    this.searchLogCurrentPage.set(1);
    this.loadSearchLogs(1);
  }

  protected clearSearchLogFilters(): void {
    this.searchLogQuery.set('');
    this.searchLogSource.set(null);
    this.searchLogStart.set('');
    this.searchLogEnd.set('');
    this.searchLogCurrentPage.set(1);
    this.loadSearchLogs(1);
  }

  protected changeSearchLogPage(delta: number): void {
    const next = this.searchLogCurrentPage() + delta;
    if (next >= 1 && next <= this.searchLogTotalPages()) {
      this.searchLogCurrentPage.set(next);
      this.loadSearchLogs(next);
    }
  }
}
