import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent {
  private readonly portalDataService = inject(PortalDataService);
  
  protected readonly categories = signal<CategoryItem[]>([]);
  protected readonly categoryTotalCount = signal(0);
  protected readonly isCategoryModalOpen = signal(false);
  protected readonly selectedCategoryId = signal<string | null>(null);
  protected readonly categoryMessage = signal('');
  protected readonly categoryError = signal('');
  
  protected readonly categoryForm = {
    name: '',
    slug: ''
  };

  constructor() {
    this.loadCategories();
  }

  protected loadCategories(): void {
    this.portalDataService.getCategories().subscribe({
      next: (items) => {
        this.categories.set(items || []);
        this.categoryTotalCount.set(items?.length || 0);
      },
      error: () => this.categories.set([])
    });
  }

  protected selectCategory(item: CategoryItem): void {
    this.selectedCategoryId.set(item.id ?? null);
    this.categoryForm.name = item.name;
    this.categoryForm.slug = item.slug;
    this.categoryMessage.set('');
    this.categoryError.set('');
    this.isCategoryModalOpen.set(true);
  }

  protected clearCategorySelection(): void {
    this.selectedCategoryId.set(null);
    this.categoryForm.name = '';
    this.categoryForm.slug = '';
    this.categoryMessage.set('');
    this.categoryError.set('');
    this.isCategoryModalOpen.set(true);
  }

  protected closeCategoryModal(): void {
    this.isCategoryModalOpen.set(false);
  }

  protected createCategory(): void {
    if (!this.categoryForm.name || !this.categoryForm.slug) {
      this.categoryError.set('Name va slug la bat buoc.');
      return;
    }
    
    this.portalDataService.createCategory({
      name: this.categoryForm.name,
      slug: this.categoryForm.slug
    }).subscribe({
      next: () => {
        this.categoryMessage.set('Da tao danh muc moi.');
        this.loadCategories();
        setTimeout(() => this.closeCategoryModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.categoryError.set(err.error?.message || 'Khong the tao danh muc.');
      }
    });
  }

  protected saveCategory(): void {
    const id = this.selectedCategoryId();
    if (!id) return;

    this.portalDataService.updateCategory(id, {
      name: this.categoryForm.name,
      slug: this.categoryForm.slug
    }).subscribe({
      next: () => {
        this.categoryMessage.set('Da cap nhat danh muc.');
        this.loadCategories();
        setTimeout(() => this.closeCategoryModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.categoryError.set(err.error?.message || 'Khong the cap nhat.');
      }
    });
  }

  protected deleteSelectedCategory(): void {
    const id = this.selectedCategoryId();
    if (!id || !confirm('Ban co chac muon xoa danh muc nay?')) return;

    this.portalDataService.deleteCategory(id).subscribe({
      next: () => {
        this.categoryMessage.set('Da xoa danh muc.');
        this.loadCategories();
        setTimeout(() => this.closeCategoryModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.categoryError.set(err.error?.message || 'Khong the xoa.');
      }
    });
  }
}
