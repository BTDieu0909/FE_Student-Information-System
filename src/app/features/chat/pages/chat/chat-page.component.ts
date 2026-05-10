import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  ChatService,
  ChatSourceReference,
  RetrievedChunkReference,
  RetrievedDepartmentReference,
  RetrievedFileReference,
} from "../../services/chat.service";

export interface ChatMessage {
  role: "user" | "bot";
  text?: string;
  type?: "text" | "rich" | "error" | "no_data";
  timestamp: Date;
  botName?: string;
  source?: string;
  matchedDocuments?: any[];
  sources?: ChatSourceReference[];
  retrievedChunks?: RetrievedChunkReference[];
  retrievedFiles?: RetrievedFileReference[];
  retrievedDepartments?: RetrievedDepartmentReference[];
  detectedIntent?: string;
  confidenceScore?: number;
  formattedText?: import("@angular/platform-browser").SafeHtml;
}

@Component({
  selector: "app-chat-page",
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat-page.component.html",
  styleUrl: "./chat-page.component.css",
})
export class ChatPageComponent {
  private readonly chatService = inject(ChatService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly question = signal("");
  readonly loading = signal(false);
  readonly previewOpen = signal(false);
  readonly previewTitle = signal("");
  readonly previewUrl = signal<SafeResourceUrl | null>(null);
  readonly previewExternalUrl = signal<string | null>(null);
  readonly previewMode = signal<"embed" | "external" | "unsupported">("embed");
  readonly messages = signal<ChatMessage[]>([
    {
      role: "bot",
      text: "Chào bạn! Tôi là trợ lý ảo Z-Bot của Đại học Quy Nhơn. Tôi có thể giúp bạn tra cứu điểm số, lịch học, các quy định đào tạo hoặc hỗ trợ giải đáp thắc mắc về đời sống sinh viên. Bạn cần giúp gì hôm nay?",
      formattedText: "Chào bạn! Tôi là trợ lý ảo Z-Bot của Đại học Quy Nhơn. Tôi có thể giúp bạn tra cứu điểm số, lịch học, các quy định đào tạo hoặc hỗ trợ giải đáp thắc mắc về đời sống sinh viên. Bạn cần giúp gì hôm nay?",
      timestamp: new Date(),
      botName: "Z-BOT ASSISTANT",
    },
  ]);

  readonly suggestions = [
    {
      title: "Cách tính điểm rèn luyện?",
      category: "Quy định đào tạo",
      icon: "description",
    },
    {
      title: "Lịch thi học kỳ này?",
      category: "Thông tin khảo thí",
      icon: "calendar_month",
    },
    {
      title: "Quy trình đăng ký tạm trú?",
      category: "Hành chính sinh viên",
      icon: "home",
    },
    {
      title: "Mất thẻ sinh viên cần làm gì?",
      category: "Hỗ trợ kỹ thuật",
      icon: "badge",
    },
  ];

  readonly canSubmit = computed(
    () => this.question().trim().length > 0 && !this.loading(),
  );

  submit(): void {
    const value = this.question().trim();
    if (!value || this.loading()) return;

    // Add user message
    const userMsg: ChatMessage = {
      role: "user",
      text: value,
      timestamp: new Date(),
    };
    this.messages.update((prev) => [...prev, userMsg]);
    this.question.set("");

    this.loading.set(true);

    this.chatService.ask(value).subscribe({
      next: (response) => {
        this.loading.set(false);
        const botMsg: ChatMessage = {
          role: "bot",
          text: response.answer,
          type: (response.answerType as any) || "text",
          timestamp: new Date(),
          botName: response.botName || "Z-Bot",
          source: response.answerSource,
          matchedDocuments: response.matchedDocuments,
          sources: response.sources,
          retrievedChunks: response.retrievedChunks,
          retrievedFiles: response.retrievedFiles,
          retrievedDepartments: response.retrievedDepartments,
          detectedIntent: response.detectedIntent,
          confidenceScore: response.confidenceScore,
          formattedText: this.parseMarkdown(response.answer),
        };
        this.messages.update((prev) => [...prev, botMsg]);
      },
      error: () => {
        this.loading.set(false);
        const errorMsg: ChatMessage = {
          role: "bot",
          type: "error",
          text: "Xin lỗi, tôi gặp sự cố kỹ thuật khi xử lý yêu cầu của bạn.",
          timestamp: new Date(),
        };
        this.messages.update((prev) => [...prev, errorMsg]);
      },
    });
  }

  useSuggestion(title: string): void {
    this.question.set(title);
    this.submit();
  }

  private parseMarkdown(text: string | undefined): import("@angular/platform-browser").SafeHtml {
    if (!text) return '';
    let formatted = text;
    
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
    
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
    
    // Tự động xuống dòng và làm nổi bật các mục a), b), c)...
    formatted = formatted.replace(/(?:^|\s+)([a-h]\))\s+/g, '<br/><span class="inline-block ml-6 font-bold text-[#002555] mb-1 mt-2">$1</span> ');

    // Tự động xuống dòng và làm nổi bật các Khoản 1., 2., 3... (chỉ áp dụng nếu từ tiếp theo viết hoa)
    formatted = formatted.replace(/(?:^|\s+)(\d+\.)\s+(?=\p{Lu})/gu, '<br/><span class="inline-block ml-2 mt-2 font-bold text-[#00347a]">$1</span> ');

    // List items (lines starting with * or - and a space)
    formatted = formatted.replace(/^[\s]*[\*\-]\s+(.*)$/gm, '<li class="ml-6 list-disc my-1.5 pl-1 text-slate-700 marker:text-[#002555]">$1</li>');
    
    // Wrap lists
    formatted = formatted.replace(/(<li.*?>.*?<\/li>\n?)+/g, '<ul class="my-4 space-y-1 block">$&</ul>');

    // Paragraphs / Newlines
    formatted = formatted.replace(/\n/g, '<br/>');
    formatted = formatted.replace(/<br\/>\s*<ul/g, '<ul');
    formatted = formatted.replace(/<\/ul>\s*<br\/>/g, '</ul>');
    
    // Clean up empty lines
    formatted = formatted.replace(/(<br\/>){3,}/g, '<br/><br/>');
    
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  openDocument(doc: any): void {
    if (!doc) return;
    const filePath =
      typeof doc.filePath === "string" ? doc.filePath.trim() : "";
    const preview = this.resolvePreview(doc, filePath);

    if (!preview) return;

    this.previewTitle.set(doc.title || "Tài liệu");
    this.previewMode.set(preview.mode);
    this.previewExternalUrl.set(preview.url ?? null);
    this.previewUrl.set(
      preview.url
        ? this.sanitizer.bypassSecurityTrustResourceUrl(preview.url)
        : null,
    );
    this.previewOpen.set(true);
  }

  private resolvePreview(
    doc: any,
    filePath: string,
  ): { url?: string; mode: "embed" | "external" | "unsupported" } | null {
    if (filePath && this.isGoogleDriveFolder(filePath)) {
      return {
        url: this.toGoogleDriveFolderUrl(filePath) ?? undefined,
        mode: "unsupported",
      };
    }

    if (filePath && /^https?:\/\//i.test(filePath)) {
      const drivePreviewUrl = this.toGoogleDrivePreviewUrl(filePath);
      return {
        url: drivePreviewUrl ?? filePath,
        mode: drivePreviewUrl ? "embed" : "external",
      };
    }

    const documentId =
      doc.parentFileId || doc.documentId || doc.id || doc.fileId || "";

    if (documentId) {
      return { url: `/api/Document/preview/${documentId}`, mode: "embed" };
    }

    if (filePath && (filePath.startsWith("/api/") || filePath.startsWith("/uploads/"))) {
      return { url: filePath, mode: "embed" };
    }

    return null;
  }

  openPreviewExternally(): void {
    const url = this.previewExternalUrl();
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  private isGoogleDriveFolder(filePath: string): boolean {
    return /drive\.google\.com\/drive\/folders\//i.test(filePath);
  }

  private toGoogleDriveFolderUrl(filePath: string): string | null {
    const normalized = filePath.trim();
    const folderMatch = normalized.match(
      /drive\.google\.com\/drive\/folders\/([^/?#]+)/i,
    );
    if (folderMatch?.[1]) {
      return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
    }
    return null;
  }

  private toGoogleDrivePreviewUrl(filePath: string): string | null {
    const normalized = filePath.trim();

    const driveFileMatch = normalized.match(
      /drive\.google\.com\/file\/d\/([^/]+)/i,
    );
    if (driveFileMatch?.[1]) {
      return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
    }

    const docsMatch = normalized.match(
      /docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([^/]+)/i,
    );
    if (docsMatch?.[1] && docsMatch?.[2]) {
      return `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`;
    }

    const idMatch = normalized.match(/[?&]id=([^&]+)/i);
    if (idMatch?.[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    return null;
  }

  closeDocumentPreview(): void {
    this.previewOpen.set(false);
    this.previewTitle.set("");
    this.previewUrl.set(null);
    this.previewExternalUrl.set(null);
    this.previewMode.set("embed");
  }
}
