import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-modal',
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './chat-modal.component.html',
  styleUrl: './chat-modal.component.scss',
})
export class ChatModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() companionId: string | null = null;

  chats: any[] = [];
  loading = true;
  error: string | null = null;
  messages: any[] = [];
  cargoFlag: any = null;
  blockedFlag: any = null;
  dialogue: any = null;
  messageText: string = '';

  constructor(private http: HttpClient, private chatService: ChatService) {}

  ngOnInit(): void {
    const idAccount = localStorage.getItem('accountId');
    if (!idAccount) {
      this.error = 'Не найден accountId';
      this.loading = false;
      return;
    }
    if (this.companionId) {
      this.chatService.getDialogue(idAccount, this.companionId).subscribe({
        next: (data) => {
          this.messages = data?.messages || [];
          this.cargoFlag = data?.cargo_flag;
          this.blockedFlag = data?.blocked_flag;
          this.dialogue = data?.dialogue;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Ошибка загрузки диалога';
          this.loading = false;
        },
      });
    } else {
      this.chatService.getChatsList(idAccount).subscribe({
        next: (data) => {
          this.chats = data?.result || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Ошибка загрузки чатов';
          this.loading = false;
        },
      });
    }
  }

  backToChats() {
    this.companionId = null;
    this.loading = true;
    this.error = null;
    this.chats = [];
    const idAccount = localStorage.getItem('accountId');
    if (!idAccount) {
      this.error = 'Не найден accountId';
      this.loading = false;
      return;
    }
    this.chatService.getChatsList(idAccount).subscribe({
      next: (data) => {
        this.chats = data?.result || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки чатов';
        this.loading = false;
      },
    });
  }
}
