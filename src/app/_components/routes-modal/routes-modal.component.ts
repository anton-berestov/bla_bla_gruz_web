import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import moment from 'moment';
import 'moment/locale/ru';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-routes-modal',
  imports: [CommonModule, DatePipe],
  templateUrl: './routes-modal.component.html',
  styleUrl: './routes-modal.component.scss',
})
export class RoutesModalComponent implements OnInit {
  @Input() routes: any[] = [];

  public appService = inject(AppService);

  constructor() {
    moment.locale('ru');
  }

  ngOnInit() {
    this.appService
      .getRoutes()
      .subscribe((data) => (this.routes = data.routes));
  }
  calculateTimeDifference(date1: string, date2: string): string {
    const time1 = new Date(Number(date1) * 1000).getTime();
    const time2 = new Date(Number(date2) * 1000).getTime();
    const differenceInMs = Math.abs(time1 - time2);
    const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}
