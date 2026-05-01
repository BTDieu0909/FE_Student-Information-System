import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface MatchedDocumentInfo {
  id?: string;
  title: string;
  parentFileId?: string;
  chunkIndex: number;
  fileName: string;
  fileType?: string;
  filePath?: string;
}

export interface ChatSourceReference {
  sourceType: string;
  documentId?: string;
  title?: string;
  chapterTitle?: string;
  articleTitle?: string;
  pageFrom?: number | null;
  pageTo?: number | null;
  filePath?: string;
  departmentName?: string;
  email?: string;
  phone?: string;
}

export interface RetrievedChunkReference {
  documentId?: string;
  title: string;
  chapterTitle?: string | null;
  articleTitle?: string | null;
  pageFrom?: number | null;
  pageTo?: number | null;
  sectionType?: string | null;
}

export interface RetrievedFileReference {
  documentId?: string;
  title: string;
  filePath?: string | null;
}

export interface RetrievedDepartmentReference {
  departmentId?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
}

export interface ChatResponse {
  question: string;
  answer: string;
  answerSource: string;
  answerType: string;
  matchedDocuments: MatchedDocumentInfo[];
  sources?: ChatSourceReference[];
  retrievedChunks?: RetrievedChunkReference[];
  retrievedFiles?: RetrievedFileReference[];
  retrievedDepartments?: RetrievedDepartmentReference[];
  detectedIntent?: string;
  confidenceScore?: number;
  responseTimeMs: number;
  status: string;
  botName: string;
}

@Injectable({ providedIn: "root" })
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  ask(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>("/api/Chat/ask-post", { question });
  }
}
