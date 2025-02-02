import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { DatePipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { routes } from '../../app.routes';
import moment from 'moment';
import 'moment/locale/ru'

@Component({
  selector: 'app-routes',
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    NgClass,
    NgStyle,
  ],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss'
})
export class RoutesComponent {
  constructor(protected appService: AppService) {
    moment.locale('ru');
  }

  public activeIndex: number | null = null;

  formatDate(): string {
    const timestamp = this.appService.searchDate * 1000;
    let formattedDate: string;
    formattedDate = moment(timestamp).format('dddd, D MMMM');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
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

  toggleAdditional(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  protected readonly routes = routes;
  protected readonly moment = moment;
}
