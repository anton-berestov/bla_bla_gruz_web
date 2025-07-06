import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdvantagesComponent } from './_components/advantages/advantages.component';
import { BlogComponent } from './_components/blog/blog.component';
import { ChatModalComponent } from './_components/chat-modal/chat-modal.component';
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
export class AppComponent implements OnInit {
  title = 'BlaBlaGruz';
  isChatModalOpen = false;
  chatCompanionId: string | null = null;

  constructor(protected appService: AppService) {}

  ngOnInit(): void {
    this.appService.getCargoTypes();
  }

  openChatModal() {
    if (this.isChatModalOpen && !this.chatCompanionId) {
      this.isChatModalOpen = false;
    } else {
      this.isChatModalOpen = true;
      this.chatCompanionId = null;
    }
  }

  openDialogue(companionId: string) {
    this.isChatModalOpen = true;
    this.chatCompanionId = companionId;
  }
}
