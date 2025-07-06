import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatsList(accountId: string): Observable<any> {
    const formData = new FormData();
    formData.append('account', accountId);
    return this.http.post<any>('/rest/dialogues/get_list', formData);
  }

  getDialogue(accountId: string, companionId: string): Observable<any> {
    const formData = new FormData();
    formData.append('account', accountId);
    formData.append('companion', companionId);
    return this.http.post<any>('/rest/dialogues/get_dialogue', formData);
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
    return this.http.post<any>('/rest/dialogues/send', formData);
  }
}
