import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentItem {
  parentFileId?: string;
  title: string;
  fileName: string;
  fileType: string;
  departmentId?: string;
  categoryId?: string;
  uploadDate: string;
  chunksCount: number;
  preview: string;
  matchedChunks: number;
  filePath?: string;
}

export interface DocumentResponse {
  items: DocumentItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  departmentId?: string;
  categoryId?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
}

export interface SearchLogItem {
  id?: string;
  query: string;
  createdAt: string;
  isAIAnswered: boolean;
  answerSource: string;
  answerPreview: string;
  departmentId?: string | null;
}

export interface SearchLogSummary {
  total: number;
  ai: number;
  faq: number;
  fallback: number;
  noData: number;
  error: number;
}

export interface ActorItem {
  id: string;
  username: string;
  fullName: string;
  role: string;
  departmentId: string;
}

export interface UploadDocumentPayload {
  title: string;
  departmentId: string;
  categoryId: string;
  file: File;
}

export interface UploadDocumentLinkPayload {
  title: string;
  departmentId: string;
  categoryId: string;
  link: string;
}

export interface UpdateDocumentPayload {
  title: string;
  departmentId?: string;
  categoryId?: string;
}

export interface FaqPayload {
  question: string;
  answer: string;
  departmentId: string;
  categoryId: string;
}

@Injectable({ providedIn: 'root' })
export class PortalDataService {
  constructor(private readonly http: HttpClient) { }

  getDocuments(params?: Record<string, string | number>): Observable<DocumentResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (`${value}`.trim().length > 0) {
        searchParams.set(key, `${value}`);
      }
    });

    const query = searchParams.toString();
    const url = query ? `/api/Document?${query}` : '/api/Document?Page=1&PageSize=10';
    return this.http.get<DocumentResponse>(url);
  }

  getFaqs(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>('/api/Faq');
  }

  getCategories(): Observable<CategoryItem[]> {
    return this.http.get<CategoryItem[]>('/api/Category');
  }

  getDepartments(): Observable<DepartmentItem[]> {
    return this.http.get<DepartmentItem[]>('/api/Department');
  }

  getSearchLogs(limit = 6): Observable<SearchLogItem[]> {
    return this.http.get<SearchLogItem[]>(`/api/SearchLog?limit=${limit}`);
  }

  getSearchLogSummary(): Observable<SearchLogSummary> {
    return this.http.get<SearchLogSummary>('/api/SearchLog/summary');
  }

  getActors(): Observable<ActorItem[]> {
    return this.http.get<ActorItem[]>('/api/Actor');
  }

  uploadDocument(payload: UploadDocumentPayload): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('Title', payload.title);
    formData.append('DepartmentId', payload.departmentId);
    formData.append('CategoryId', payload.categoryId);
    return this.http.post('/api/Document/upload', formData);
  }

  uploadDocumentLink(payload: UploadDocumentLinkPayload): Observable<unknown> {
    return this.http.post('/api/Document/upload-link', payload);
  }

  updateDocument(parentFileId: string, payload: UpdateDocumentPayload): Observable<unknown> {
    return this.http.put(`/api/Document/${parentFileId}`, payload);
  }

  deleteDocument(parentFileId: string): Observable<unknown> {
    return this.http.delete(`/api/Document/${parentFileId}`);
  }

  createFaq(payload: FaqPayload): Observable<unknown> {
    return this.http.post('/api/Faq', payload);
  }

  updateFaq(id: string, payload: FaqPayload): Observable<unknown> {
    return this.http.put(`/api/Faq/${id}`, payload);
  }

  deleteFaq(id: string): Observable<unknown> {
    return this.http.delete(`/api/Faq/${id}`);
  }
}
