import { DocumentItem } from "../../../core/services/portal-data.service";

export interface DocumentResponse {
  items: DocumentItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CategoryPayload {
  name: string;
  slug: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
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

export interface FaqPayload {
  question: string;
  answer: string;
  departmentId: string;
  categoryId: string;
}
