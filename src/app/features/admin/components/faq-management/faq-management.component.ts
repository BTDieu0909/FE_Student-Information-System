import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryItem, DepartmentItem, FaqItem, PortalDataService } from '../../../../core/services/portal-data.service';

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
  protected readonly allFaqs = signal<FaqItem[]>([]);
  protected readonly faqTotalCount = signal(0);
  protected readonly faqSearchQuery = signal('');
  protected readonly faqLoading = signal(false);
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

    // Auto-search when query changes with debounce
    effect((onCleanup) => {
      const q = this.faqSearchQuery();
      const timer = setTimeout(() => {
        // if we already have data, filter client-side for instant feedback
        if (this.allFaqs().length > 0) {
          this.applyFilter();
        } else if (!this.faqLoading()) {
          this.loadFaqs();
        }
      }, 150);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected loadFaqs(): void {
    this.faqLoading.set(true);
    this.faqError.set('');

    this.portalDataService
      .getFaqs({ Query: this.faqSearchQuery(), Page: 1, PageSize: 1000 })
      .subscribe({
        next: (response) => {
          const items = response.items || [];
          this.allFaqs.set(items);
          this.faqTotalCount.set(items.length);
          this.applyFilter();
          this.faqLoading.set(false);
        },
        error: (err: any) => {
          this.allFaqs.set([]);
          this.faqs.set([]);
          this.faqError.set(err?.error?.message || err?.message || 'Không thể tải danh sách FAQ.');
          this.faqLoading.set(false);
        },
      });
  }

  protected applyFilter(): void {
    const q = this.faqSearchQuery().trim().toLowerCase();
    if (!q) {
      const all = this.allFaqs();
      this.faqs.set(all);
      this.faqTotalCount.set(all.length);
      return;
    }

    const filtered = this.allFaqs().filter((f) => {
      return (
        f.question.toLowerCase().includes(q) ||
        (f.answer || '').toLowerCase().includes(q)
      );
    });

    this.faqs.set(filtered);
    this.faqTotalCount.set(filtered.length);
  }

  protected searchFaqs(): void {
    this.loadFaqs();
  }

  protected currentFaq(): FaqItem | null {
    const id = this.selectedFaqId();
    return id ? (this.allFaqs().find(f => f.id === id) ?? null) : null;
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
        this.faqMessage.set('Bạn đã tạo FAQ thành công.');
        this.loadFaqs();
        setTimeout(() => this.closeFaqModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.faqError.set(err.error?.message || 'Không thể tạo FAQ.');
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
        this.faqMessage.set('Đã cập nhật thành công');
        this.loadFaqs();
        setTimeout(() => this.closeFaqModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        if (err && (err.status === 200 || err.status === 204)) {
          this.faqMessage.set('Đã cập nhật thành công');
          this.loadFaqs();
          setTimeout(() => this.closeFaqModal(), 1000);
          return;
        }

        this.faqError.set(err.error?.message || 'Không thể cập nhật.');
      }
    });
  }

  protected deleteSelectedFaq(): void {
    const id = this.selectedFaqId();
    if (!id || !confirm('Bạn có chắc chắn muốn xóa FAQ này? Thao tác này không thể hoàn tác.')) return;

    this.portalDataService.deleteFaq(id).subscribe({
      next: () => {
        this.faqMessage.set('Đã xóa FAQ thành công.');
        // remove from local lists so UI updates immediately
        const remainingAll = this.allFaqs().filter((f) => f.id !== id);
        this.allFaqs.set(remainingAll);
        this.applyFilter();
        this.selectedFaqId.set(null);
        this.faqForm.question = '';
        this.faqForm.answer = '';
        this.faqForm.departmentId = '';
        this.faqForm.categoryId = '';
        setTimeout(() => this.closeFaqModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        if (err && (err.status === 200 || err.status === 204)) {
          this.faqMessage.set('Đã xóa FAQ thành công.');
          const remainingAll = this.allFaqs().filter((f) => f.id !== id);
          this.allFaqs.set(remainingAll);
          this.applyFilter();
          this.selectedFaqId.set(null);
          this.faqForm.question = '';
          this.faqForm.answer = '';
          this.faqForm.departmentId = '';
          this.faqForm.categoryId = '';
          setTimeout(() => this.closeFaqModal(), 1000);
          return;
        }

        this.faqError.set(err.error?.message || 'Không thể xóa FAQ.');
      }
    });
  }
}
