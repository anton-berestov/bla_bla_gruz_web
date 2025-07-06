import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvantagesComponent } from './_components/advantages/advantages.component';
import { BlogComponent } from './_components/blog/blog.component';
import { ChatModalComponent } from './_components/chat-modal/chat-modal.component';
import { ChatService } from './_components/chat-modal/chat.service';
import { FooterComponent } from './_components/footer/footer.component';
import { HeaderComponent } from './_components/header/header.component';
import { RoutesComponent } from './_components/routes/routes.component';
import { SearchComponent } from './_components/search/search.component';
import { StoreComponent } from './_components/store/store.component';
import { ToastComponent } from './_components/toast/toast.component';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    AdvantagesComponent,
    StoreComponent,
    BlogComponent,
    NgIf,
    RoutesComponent,
    ToastComponent,
    ChatModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'BlaBlaGruz';
  isChatModalOpen = false;
  chatCompanionId: string = '';
  hasNewMessages: boolean = false;
  private newMessagesInterval: any = null;

  constructor(
    protected appService: AppService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.appService.getCargoTypes();
    this.startNewMessagesPolling();
  }

  ngOnDestroy(): void {
    if (this.newMessagesInterval) {
      clearInterval(this.newMessagesInterval);
    }
  }

  startNewMessagesPolling() {
    this.checkNewMessages();
    this.newMessagesInterval = setInterval(() => {
      this.checkNewMessages();
    }, 5000);
  }

  checkNewMessages() {
    const idAccount = localStorage.getItem('accountId');
    if (!idAccount) {
      this.hasNewMessages = false;
      return;
    }
    this.chatService.getChatsList(idAccount).subscribe({
      next: (data) => {
        const chats = data?.dialogues || [];
        this.hasNewMessages = chats.some(
          (chat: any) => chat.new_messages && chat.new_messages > 0
        );
      },
      error: () => {
        this.hasNewMessages = false;
      },
    });
  }

  openChatModal() {
    if (this.isChatModalOpen && !this.chatCompanionId) {
      this.isChatModalOpen = false;
    } else {
      this.isChatModalOpen = true;
      this.chatCompanionId = '';
      this.hasNewMessages = false;
    }
  }

  openDialogue(companionId: string) {
    this.isChatModalOpen = true;
    this.chatCompanionId = companionId || '';
  }
}
