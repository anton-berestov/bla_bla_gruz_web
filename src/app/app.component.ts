import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './_components/header/header.component';
import { FooterComponent } from './_components/footer/footer.component';
import { SearchComponent } from './_components/search/search.component';
import { AdvantagesComponent } from './_components/advantages/advantages.component';
import { StoreComponent } from './_components/store/store.component';
import { BlogComponent } from './_components/blog/blog.component';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { RoutesComponent } from './_components/routes/routes.component';
import { ToastComponent } from './_components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [ HeaderComponent, FooterComponent, SearchComponent, AdvantagesComponent, StoreComponent, BlogComponent, NgIf, RoutesComponent, ToastComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ HttpClient ]
})
export class AppComponent implements OnInit {
  title = 'BlaBlaGruz';

  constructor(protected appService: AppService) {
  }

  ngOnInit(): void {
    this.appService.getCargoTypes()
  }
}
