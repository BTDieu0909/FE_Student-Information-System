import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  question: string;
  answer: string;
  answerSource: string;
  matchedDocuments: unknown[];
  responseTimeMs: number;
  status: string;
  botName: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  ask(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>('/api/Chat/ask-post', { question });
  }
}
