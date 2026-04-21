import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

export interface ChatMessage {
  role: 'user' | 'bot';
  text?: string;
  type?: 'text' | 'rich' | 'error' | 'no_data';
  timestamp: Date;
  botName?: string;
  source?: string;
  matchedDocuments?: any[];
}

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
  readonly messages = signal<ChatMessage[]>([
    {
      role: 'bot',
      text: 'Chào bạn! Tôi là trợ lý ảo Z-Bot của Đại học Quy Nhơn. Tôi có thể giúp bạn tra cứu điểm số, lịch học, các quy định đào tạo hoặc hỗ trợ giải đáp thắc mắc về đời sống sinh viên. Bạn cần giúp gì hôm nay?',
      timestamp: new Date(),
      botName: 'Z-BOT ASSISTANT'
    }
  ]);

  readonly suggestions = [
    { title: 'Cách tính điểm rèn luyện?', category: 'Quy định đào tạo', icon: 'description' },
    { title: 'Lịch thi học kỳ này?', category: 'Thông tin khảo thí', icon: 'calendar_month' },
    { title: 'Quy trình đăng ký tạm trú?', category: 'Hành chính sinh viên', icon: 'home' },
    { title: 'Mất thẻ sinh viên cần làm gì?', category: 'Hỗ trợ kỹ thuật', icon: 'badge' }
  ];


  readonly canSubmit = computed(() => this.question().trim().length > 0 && !this.loading());

  submit(): void {
    const value = this.question().trim();
    if (!value || this.loading()) return;

    // Add user message
    const userMsg: ChatMessage = {
      role: 'user',
      text: value,
      timestamp: new Date()
    };
    this.messages.update(prev => [...prev, userMsg]);
    this.question.set('');

    this.loading.set(true);

    this.chatService.ask(value).subscribe({
      next: (response) => {
        this.loading.set(false);
        const botMsg: ChatMessage = {
          role: 'bot',
          text: response.answer,
          type: response.answerType as any || 'text',
          timestamp: new Date(),
          botName: response.botName || 'Z-Bot',
          source: response.answerSource,
          matchedDocuments: response.matchedDocuments
        };
        this.messages.update(prev => [...prev, botMsg]);
      },
      error: () => {
        this.loading.set(false);
        const errorMsg: ChatMessage = {
          role: 'bot',
          type: 'error',
          text: 'Xin lỗi, tôi gặp sự cố kỹ thuật khi xử lý yêu cầu của bạn.',
          timestamp: new Date()
        };
        this.messages.update(prev => [...prev, errorMsg]);
      }
    });
  }

  useSuggestion(title: string): void {
    this.question.set(title);
    this.submit();
  }

  openDocument(doc: any): void {
    if (!doc) return;
    if (doc.fileType === 'link' && doc.filePath) {
      window.open(doc.filePath, '_blank');
    } else {
      const downloadUrl = `/api/Document/download/${doc.parentFileId || doc.id}`;
      window.open(downloadUrl, '_blank');
    }
  }
}


