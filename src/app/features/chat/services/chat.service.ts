import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchedDocumentInfo {
  id?: string;
  title: string;
  parentFileId?: string;
  chunkIndex: number;
  fileName: string;
  fileType?: string;
  filePath?: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  answerSource: string;
  answerType: string;
  matchedDocuments: MatchedDocumentInfo[];
  responseTimeMs: number;
  status: string;
  botName: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private readonly http: HttpClient) { }

  ask(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>('/api/Chat/ask-post', { question });
  }
}
