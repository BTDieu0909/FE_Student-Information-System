import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FaqItem, PortalDataService } from '../../services/portal-data.service';

@Component({
  selector: 'app-faq-page',
  imports: [CommonModule],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.css'
})
export class FaqPageComponent {
  private readonly portalDataService = inject(PortalDataService);

  readonly items = signal<FaqItem[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.portalDataService.getFaqs().subscribe({
      next: (response) => {
        this.items.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Khong the tai FAQ.');
        this.loading.set(false);
      }
    });
  }
}
