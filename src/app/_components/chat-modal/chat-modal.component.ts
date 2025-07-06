import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-modal',
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './chat-modal.component.html',
  styleUrl: './chat-modal.component.scss',
})
export class ChatModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Input() companionId: string = '';

  chats: any[] = [];
  loading = true;
  error: string | null = null;
  messages: any[] = [];
  cargoFlag: any = null;
  blockedFlag: any = null;
  dialogue: any = null;
  messageText: string = '';
  sending = false;
  companionName: string = '';
  accountId: string = '';
  private dialogueInterval: any = null;

  constructor(private http: HttpClient, private chatService: ChatService) {}

  ngOnInit(): void {
    this.accountId = localStorage.getItem('accountId') || '';
    if (this.companionId) {
      this.startDialoguePolling();
      const chat = this.chats.find((c) => c.user.account == this.companionId);
      if (chat) {
        this.companionName =
          (chat.user.name || '') + ' ' + (chat.user.surname || '');
      } else {
        this.companionName = '';
      }
      this.chatService.getDialogue(this.accountId, this.companionId).subscribe({
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
      this.clearDialoguePolling();
      this.chatService.getChatsList(this.accountId).subscribe({
        next: (data) => {
          this.chats = data?.dialogues || [];
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
    this.companionId = '';
    this.companionName = '';
    this.loading = true;
    this.error = null;
    this.chats = [];
    this.clearDialoguePolling();
    this.chatService.getChatsList(this.accountId).subscribe({
      next: (data) => {
        this.chats = data?.dialogues || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки чатов';
        this.loading = false;
      },
    });
  }

  onSendMessage() {
    if (
      !this.messageText.trim() ||
      this.sending ||
      !this.dialogue ||
      !this.companionId
    )
      return;
    this.sending = true;
    this.chatService
      .sendMessage({
        account: this.accountId,
        sender: this.accountId,
        recipient: this.companionId,
        dialogue: this.dialogue,
        text: this.messageText.trim(),
      })
      .subscribe({
        next: () => {
          this.messageText = '';
          // После отправки — обновить сообщения
          this.chatService
            .getDialogue(this.accountId, this.companionId)
            .subscribe({
              next: (data) => {
                this.messages = data?.messages || [];
                this.cargoFlag = data?.cargo_flag;
                this.blockedFlag = data?.blocked_flag;
                this.dialogue = data?.dialogue;
                this.sending = false;
              },
              error: () => {
                this.sending = false;
              },
            });
        },
        error: () => {
          this.sending = false;
        },
      });
  }

  openChatDialogue(chat: any) {
    this.companionId = chat.user.account;
    this.companionName =
      (chat.user.name || '') + ' ' + (chat.user.surname || '');
    this.loading = true;
    this.error = null;
    this.messages = [];
    this.cargoFlag = null;
    this.blockedFlag = null;
    this.dialogue = null;
    this.startDialoguePolling();
    this.chatService.getDialogue(this.accountId, this.companionId).subscribe({
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
  }

  onEnter(event: Event) {
    if (
      'key' in event &&
      (event as KeyboardEvent).key === 'Enter' &&
      !(event as KeyboardEvent).shiftKey
    ) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  startDialoguePolling() {
    this.clearDialoguePolling();
    this.dialogueInterval = setInterval(() => {
      if (this.companionId && this.accountId) {
        this.chatService
          .getDialogue(this.accountId, this.companionId)
          .subscribe({
            next: (data) => {
              this.messages = data?.messages || [];
              this.cargoFlag = data?.cargo_flag;
              this.blockedFlag = data?.blocked_flag;
              this.dialogue = data?.dialogue;
            },
          });
      }
    }, 5000);
  }

  clearDialoguePolling() {
    if (this.dialogueInterval) {
      clearInterval(this.dialogueInterval);
      this.dialogueInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearDialoguePolling();
  }
}
