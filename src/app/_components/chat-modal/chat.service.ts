import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  getChatsList(accountId: string): Observable<any> {
    const formData = new FormData();
    formData.append('account', accountId);
    return this.http.post<any>(`${this.baseUrl}/dialogues/get_list`, formData);
  }

  getDialogue(accountId: string, companionId: string): Observable<any> {
    const formData = new FormData();
    formData.append('account', accountId);
    formData.append('companion', companionId);
    return this.http.post<any>(
      `${this.baseUrl}/dialogues/get_dialogue`,
      formData
    );
  }

  sendMessage(body: {
    account: string;
    sender: string;
    recipient: string;
    dialogue: string;
    text: string;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('account', body.account);
    formData.append('sender', body.sender);
    formData.append('recipient', body.recipient);
    formData.append('dialogue', body.dialogue);
    formData.append('text', body.text);
    return this.http.post<any>(`${this.baseUrl}/dialogues/send`, formData);
  }
}
