import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqItem, PortalDataService } from '../../services/portal-data.service';

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

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.portalDataService.getFaqs().subscribe({
      next: (response) => {
        const map = new Map<string, FaqItem>();
        for (const it of response || []) {
          if (it.id) map.set(it.id, it);
        }
        this.items.set(Array.from(map.values()));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Khong the tai FAQ.');
        this.loading.set(false);
      }
    });
  }

onKeywordChange(value: string): void {
  this.keyword.set(value);
}
  
 search(): void {
  const q = this.keyword().trim();
  this.loading.set(true);
  this.errorMessage.set('');

  const params = q ? { Keyword: q } : undefined;

  this.portalDataService.getFaqs(params).subscribe({
    next: (response) => {
      const map = new Map<string, FaqItem>();

      for (const it of response || []) {
        const key = it?.id || (it.question ?? '');
        map.set(key, it);
      }

      let deduped = Array.from(map.values());

      // Nếu backend chưa filter đúng kiểu LIKE,
      // thì filter phía client chỉ theo question
      if (q) {
        const keyword = q.toLowerCase();

        deduped = deduped.filter((f) =>
          (f.question || '').toLowerCase().includes(keyword)
        );
      }

      this.items.set(deduped);
      this.loading.set(false);
    },
    error: () => {
      this.errorMessage.set('Khong the tim FAQ.');
      this.loading.set(false);
    }
  });
}
}