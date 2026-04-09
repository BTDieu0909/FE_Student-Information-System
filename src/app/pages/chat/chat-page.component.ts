import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  private readonly chatService = inject(ChatService);

  readonly question = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly answer = signal('');
  readonly answerSource = signal('');
  readonly answerType = signal('');
  readonly botName = signal('');
  readonly matchedDocuments = signal<any[]>([]);

  readonly canSubmit = computed(() => this.question().trim().length > 0 && !this.loading());

  submit(): void {
    const value = this.question().trim();
    if (!value || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.answerType.set('');

    this.chatService.ask(value).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.answer.set(response.answer);
        this.answerSource.set(response.answerSource);
        this.answerType.set(response.answerType);
        this.botName.set(response.botName);
        this.matchedDocuments.set(response.matchedDocuments || []);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Khong the lay cau tra loi tu he thong.');
      }
    });
  }

  openDocument(doc: any): void {
    if (!doc) return;

    if (doc.fileType === 'link' && doc.filePath) {
      window.open(doc.filePath, '_blank');
    } else {
      // Gọi API download đã thêm ở backend
      const downloadUrl = `/api/Document/download/${doc.parentFileId || doc.id}`;
      window.open(downloadUrl, '_blank');
    }
  }
}


