import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-documents-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.css'
})
export class DocumentsPageComponent {
  private readonly portalDataService = inject(PortalDataService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly keyword = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly items = signal<DocumentItem[]>([]);

  readonly previewOpen = signal(false);
  readonly previewTitle = signal("");
  readonly previewUrl = signal<SafeResourceUrl | null>(null);
  readonly previewExternalUrl = signal<string | null>(null);
  readonly previewMode = signal<"embed" | "external" | "unsupported">("embed");

  constructor() {
    this.search();
  }

  search(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.portalDataService.getDocuments({ Page: 1, PageSize: 12, Keyword: this.keyword() }).subscribe({
      next: (response) => {
        this.items.set(response.items ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Khong the tai kho tai lieu.');
        this.loading.set(false);
      }
    });
  }

  openDocument(doc: any): void {
    if (!doc) return;
    const filePath = typeof doc.filePath === "string" ? doc.filePath.trim() : "";
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

    const documentId = doc.parentFileId || doc.documentId || doc.id || doc.fileId || "";

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
    const folderMatch = normalized.match(/drive\.google\.com\/drive\/folders\/([^/?#]+)/i);
    if (folderMatch?.[1]) {
      return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
    }
    return null;
  }

  private toGoogleDrivePreviewUrl(filePath: string): string | null {
    const normalized = filePath.trim();

    const driveFileMatch = normalized.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (driveFileMatch?.[1]) {
      return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
    }

    const docsMatch = normalized.match(/docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([^/]+)/i);
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
