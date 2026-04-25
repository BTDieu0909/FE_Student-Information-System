import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FaqItem, CategoryItem, DepartmentItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-faq-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq-management.component.html',
  styleUrl: './faq-management.component.css'
})
export class FaqManagementComponent {
  @Input() departments: DepartmentItem[] = [];
  @Input() categories: CategoryItem[] = [];
  
  private readonly portalDataService = inject(PortalDataService);
  
  protected readonly faqs = signal<FaqItem[]>([]);
  protected readonly faqTotalCount = signal(0);
  protected readonly faqSearchQuery = signal('');
  protected readonly isFaqModalOpen = signal(false);
  protected readonly selectedFaqId = signal<string | null>(null);
  protected readonly faqMessage = signal('');
  protected readonly faqError = signal('');
  
  protected readonly faqForm = {
    question: '',
    answer: '',
    departmentId: '',
    categoryId: ''
  };

  constructor() {
    this.loadFaqs();
  }

  protected loadFaqs(): void {
    this.portalDataService.getFaqs({ Query: this.faqSearchQuery() }).subscribe({
      next: (response) => {
        this.faqs.set(response.items || []);
        this.faqTotalCount.set(response.totalItems || 0);
      },
      error: () => this.faqs.set([])
    });
  }

  protected searchFaqs(): void {
    this.loadFaqs();
  }

  protected currentFaq(): FaqItem | null {
    const id = this.selectedFaqId();
    return id ? (this.faqs().find(f => f.id === id) ?? null) : null;
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
    this.faqForm.question = '';
    this.faqForm.answer = '';
    this.faqForm.departmentId = '';
    this.faqForm.categoryId = '';
    this.faqMessage.set('');
    this.faqError.set('');
    this.isFaqModalOpen.set(true);
  }

  protected closeFaqModal(): void {
    this.isFaqModalOpen.set(false);
  }

  protected createFaq(): void {
    if (!this.faqForm.question || !this.faqForm.answer) {
      this.faqError.set('Cau hoi va cau tra loi la bat buoc.');
      return;
    }
    
    this.portalDataService.createFaq({
      question: this.faqForm.question,
      answer: this.faqForm.answer,
      departmentId: this.faqForm.departmentId,
      categoryId: this.faqForm.categoryId
    }).subscribe({
      next: () => {
        this.faqMessage.set('Da tao FAQ moi.');
        this.loadFaqs();
        setTimeout(() => this.closeFaqModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.faqError.set(err.error?.message || 'Khong the tao FAQ.');
      }
    });
  }

  protected saveFaq(): void {
    const id = this.selectedFaqId();
    if (!id) return;

    this.portalDataService.updateFaq(id, {
      question: this.faqForm.question,
      answer: this.faqForm.answer,
      departmentId: this.faqForm.departmentId,
      categoryId: this.faqForm.categoryId
    }).subscribe({
      next: () => {
        this.faqMessage.set('Da cap nhat FAQ.');
        this.loadFaqs();
        setTimeout(() => this.closeFaqModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.faqError.set(err.error?.message || 'Khong the cap nhat.');
      }
    });
  }

  protected deleteSelectedFaq(): void {
    const id = this.selectedFaqId();
    if (!id || !confirm('Ban co chac muon xoa FAQ nay?')) return;

    this.portalDataService.deleteFaq(id).subscribe({
      next: () => {
        this.faqMessage.set('Da xoa FAQ.');
        this.loadFaqs();
        setTimeout(() => this.closeFaqModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.faqError.set(err.error?.message || 'Khong the xoa.');
      }
    });
  }
}
