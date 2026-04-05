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

  readonly question = signal('Chuan dau ra ngoai ngu la gi?');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly answer = signal('');
  readonly answerSource = signal('');
  readonly botName = signal('');

  readonly canSubmit = computed(() => this.question().trim().length > 0 && !this.loading());

  submit(): void {
    const value = this.question().trim();
    if (!value || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.chatService.ask(value).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.answer.set(response.answer);
        this.answerSource.set(response.answerSource);
        this.botName.set(response.botName);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Khong the lay cau tra loi tu he thong.');
      }
    });
  }
}


