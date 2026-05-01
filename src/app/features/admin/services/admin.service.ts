import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  SearchLogItem,
  SearchLogPageResponse,
  SearchLogSummary,
  ActorItem,
} from "../../../core/services/portal-data.service";
import {
  DocumentResponse,
  CategoryPayload,
  DepartmentPayload,
  ActorPayload,
  UploadDocumentPayload,
  UploadDocumentLinkPayload,
  UpdateDocumentPayload,
  FaqPayload,
} from "../models/admin.models";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  // Category Management
  createCategory(payload: CategoryPayload): Observable<unknown> {
    return this.http.post("/api/Category", payload);
  }

  updateCategory(id: string, payload: CategoryPayload): Observable<unknown> {
    return this.http.put(`/api/Category/${id}`, payload);
  }

  deleteCategory(id: string): Observable<unknown> {
    return this.http.delete(`/api/Category/${id}`);
  }

  // Department Management
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

  // Actor Management
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

  // Document Management
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

  enableDocumentAi(parentFileId: string): Observable<unknown> {
    return this.http.post(
      `/api/Document/from-download-file/${parentFileId}`,
      {},
    );
  }

  processDocument(documentId: string): Observable<unknown> {
    return this.http.post(`/api/Document/${documentId}/process`, {});
  }

  updateDocument(
    id: string,
    payload: UpdateDocumentPayload,
  ): Observable<unknown> {
    return this.http.put(`/api/Document/${id}`, payload);
  }

  deleteDocument(id: string): Observable<unknown> {
    return this.http.delete(`/api/Document/${id}`);
  }

  // FAQ Management
  createFaq(payload: FaqPayload): Observable<unknown> {
    return this.http.post("/api/Faq", payload);
  }

  updateFaq(id: string, payload: FaqPayload): Observable<unknown> {
    return this.http.put(`/api/Faq/${id}`, payload);
  }

  deleteFaq(id: string): Observable<unknown> {
    return this.http.delete(`/api/Faq/${id}`);
  }

  // Search Logs
  getSearchLogsPage(
    page = 1,
    pageSize = 10,
    params?: any,
  ): Observable<SearchLogPageResponse> {
    const searchParams = new URLSearchParams({
      page: `${page}`,
      pageSize: `${pageSize}`,
    });

    if (params) {
      if (params.query?.trim()) searchParams.set("query", params.query.trim());
      if (params.source?.trim())
        searchParams.set("source", params.source.trim());
      if (params.startDate) searchParams.set("startDate", params.startDate);
      if (params.endDate) searchParams.set("endDate", params.endDate);
    }

    return this.http.get<SearchLogPageResponse>(
      `/api/SearchLog?${searchParams.toString()}`,
    );
  }

  getSearchLogSummary(): Observable<SearchLogSummary> {
    return this.http.get<SearchLogSummary>("/api/SearchLog/summary");
  }

  // System Settings
  getSystemSetting(key: string): Observable<{ key: string, value: string }> {
    return this.http.get<{ key: string, value: string }>(`/api/SystemSetting/${key}`);
  }

  updateSystemSetting(key: string, value: string): Observable<{ key: string, value: string }> {
    return this.http.put<{ key: string, value: string }>(`/api/SystemSetting/${key}`, { value });
  }
}
