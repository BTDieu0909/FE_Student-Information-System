import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ChatService } from "../../services/chat.service";
import {
  CategoryItem,
  DepartmentItem,
  DocumentItem,
  FaqItem,
  PortalDataService,
} from "../../services/portal-data.service";

@Component({
  selector: "app-home-page",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
})
export class HomePageComponent {
  private readonly chatService = inject(ChatService);
  private readonly portalDataService = inject(PortalDataService);

  readonly question = signal("Quy che dao tao hien hanh la gi?");
  readonly loading = signal(false);
  readonly errorMessage = signal("");
  readonly answer = signal("");
  readonly botName = signal("");

  readonly categories = signal<CategoryItem[]>([]);
  readonly faqs = signal<FaqItem[]>([]);
  readonly documents = signal<DocumentItem[]>([]);
  readonly departments = signal<DepartmentItem[]>([]);

  readonly quickSuggestions = [
    "Cach dang ky tam tru?",
    "Han nop hoc phi?",
    "Diem ren luyen tinh nhu the nao?",
  ];

  readonly heroSuggestions = [
    "quy che hoc tap",
    "hoc phi",
    "vay von",
    "tam hoan nghia vu",
  ];

  readonly canSubmit = computed(
    () => this.question().trim().length > 0 && !this.loading(),
  );

  constructor() {
    this.loadDashboardData();
  }

  submit(): void {
    const value = this.question().trim();
    if (!value || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set("");

    this.chatService.ask(value).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.answer.set(response.answer);
        this.botName.set(response.botName);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Khong the lay cau tra loi tu he thong.");
      },
    });
  }

  useSuggestion(value: string): void {
    this.question.set(value);
  }

  private loadDashboardData(): void {
    this.portalDataService.getCategories().subscribe({
      next: (response) => this.categories.set(response),
    });

    this.portalDataService.getFaqs().subscribe({
      next: (response) => this.faqs.set(response),
    });

    this.portalDataService.getDocuments({ Page: 1, PageSize: 20 }).subscribe({
      next: (response) => this.documents.set(response.items ?? []),
    });

    this.portalDataService.getDepartments().subscribe({
      next: (response) => this.departments.set(response),
    });
  }

  getCategoryDocumentCount(categoryId: string): number {
    return this.documents().filter((item) => item.categoryId === categoryId)
      .length;
  }

  getCategoryFaqCount(categoryId: string): number {
    return this.faqs().filter((item) => item.categoryId === categoryId).length;
  }
}
