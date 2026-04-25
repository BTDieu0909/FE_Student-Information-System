import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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

export interface FaqPagedResponse {
  items: FaqItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
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

export interface CategoryPayload {
  name: string;
  slug: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description?: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
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

export interface SearchLogPageResponse {
  items: SearchLogItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ActorItem {
  id: string;
  username: string;
  fullName: string;
  role: string;
  departmentId: string;
}

export interface ActorPayload {
  username: string;
  fullName: string;
  role: string;
  departmentId?: string;
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

export interface PdfExtractionResponse {
  message: string;
  fileName: string;
  extractionBranch: "text" | "ocr_or_mixed" | "scan_no_text" | "error";
  extractionEngine: string;
  isScannedPdf: boolean;
  textLength: number;
  lineCount: number;
  nextStep: string;
  preview: string;
  extractedText: string;
}

export interface FaqPayload {
  question: string;
  answer: string;
  departmentId: string;
  categoryId: string;
}

@Injectable({ providedIn: "root" })
export class PortalDataService {
  constructor(private readonly http: HttpClient) {}

  getDocuments(
    params?: Record<string, string | number>,
  ): Observable<DocumentResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (`${value}`.trim().length > 0) {
        searchParams.set(key, `${value}`);
      }
    });

    const query = searchParams.toString();
    const url = query
      ? `/api/Document?${query}`
      : "/api/Document?Page=1&PageSize=10";
    return this.http.get<DocumentResponse>(url);
  }

  getFaqs(params?: Record<string, string | number>): Observable<FaqPagedResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (`${value}`.trim().length > 0) {
        searchParams.set(key, `${value}`);
      }
    });

    const query = searchParams.toString();
    const url = query ? `/api/Faq?${query}` : "/api/Faq?Page=1&PageSize=5";
    return this.http.get<FaqPagedResponse>(url);
  }

  getCategories(): Observable<CategoryItem[]> {
    return this.http.get<CategoryItem[]>("/api/Category");
  }

  createCategory(payload: CategoryPayload): Observable<unknown> {
    return this.http.post("/api/Category", payload);
  }

  updateCategory(id: string, payload: CategoryPayload): Observable<unknown> {
    return this.http.put(`/api/Category/${id}`, payload);
  }

  deleteCategory(id: string): Observable<unknown> {
    return this.http.delete(`/api/Category/${id}`);
  }

  getDepartments(): Observable<DepartmentItem[]> {
    return this.http.get<DepartmentItem[]>("/api/Department");
  }

  createDepartment(payload: DepartmentPayload): Observable<unknown> {
    return this.http.post("/api/Department", payload);
  }

  updateDepartment(
    id: string,
    payload: DepartmentPayload,
  ): Observable<unknown> {
    return this.http.put(`/api/Department/${id}`, payload);
  }

  deleteDepartment(id: string): Observable<unknown> {
    return this.http.delete(`/api/Department/${id}`);
  }

  getSearchLogs(limit = 6): Observable<SearchLogItem[]> {
    return this.http.get<SearchLogItem[]>(`/api/SearchLog?limit=${limit}`);
  }

  getSearchLogsPage(
    page = 1,
    pageSize = 10,
    params?: {
      query?: string;
      source?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Observable<SearchLogPageResponse> {
    const searchParams = new URLSearchParams({
      page: `${page}`,
      pageSize: `${pageSize}`,
    });

    if (params) {
      if (params.query?.trim()) {
        searchParams.set("query", params.query.trim());
      }
      if (params.source?.trim()) {
        searchParams.set("source", params.source.trim());
      }
      if (params.startDate) {
        searchParams.set("startDate", params.startDate);
      }
      if (params.endDate) {
        searchParams.set("endDate", params.endDate);
      }
    }

    return this.http.get<SearchLogPageResponse>(
      `/api/SearchLog?${searchParams.toString()}`,
    );
  }

  getSearchLogSummary(): Observable<SearchLogSummary> {
    return this.http.get<SearchLogSummary>("/api/SearchLog/summary");
  }

  getActors(): Observable<ActorItem[]> {
    return this.http.get<ActorItem[]>("/api/Actor");
  }

  createActor(payload: ActorPayload): Observable<unknown> {
    return this.http.post("/api/Actor", payload);
  }

  updateActor(id: string, payload: ActorPayload): Observable<unknown> {
    return this.http.put(`/api/Actor/${id}`, payload);
  }

  deleteActor(id: string): Observable<unknown> {
    return this.http.delete(`/api/Actor/${id}`);
  }

  uploadDocument(payload: UploadDocumentPayload): Observable<unknown> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("Title", payload.title);
    formData.append("DepartmentId", payload.departmentId);
    formData.append("CategoryId", payload.categoryId);
    return this.http.post("/api/Document/upload", formData);
  }

  uploadDocumentLink(payload: UploadDocumentLinkPayload): Observable<unknown> {
    return this.http.post("/api/Document/upload-link", payload);
  }

  processDocumentChunks(parentFileId: string): Observable<unknown> {
    return this.http.post(`/api/Document/${parentFileId}/process-chunks`, {});
  }

  processDocumentChunksForce(parentFileId: string): Observable<unknown> {
    return this.http.post(
      `/api/Document/${parentFileId}/process-chunks-force`,
      {},
    );
  }

  extractPdf(file: File): Observable<PdfExtractionResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<PdfExtractionResponse>(
      "/api/Document/extract-pdf",
      formData,
    );
  }

  updateDocument(
    parentFileId: string,
    payload: UpdateDocumentPayload,
  ): Observable<unknown> {
    return this.http.put(`/api/Document/${parentFileId}`, payload);
  }

  deleteDocument(parentFileId: string): Observable<unknown> {
    return this.http.delete(`/api/Document/${parentFileId}`);
  }

  createFaq(payload: FaqPayload): Observable<unknown> {
    return this.http.post("/api/Faq", payload);
  }

  updateFaq(id: string, payload: FaqPayload): Observable<unknown> {
    return this.http.put(`/api/Faq/${id}`, payload);
  }

  deleteFaq(id: string): Observable<unknown> {
    return this.http.delete(`/api/Faq/${id}`);
  }
}
