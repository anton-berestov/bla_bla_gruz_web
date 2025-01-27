import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-routes',
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss'
})
export class RoutesComponent {
  constructor(protected appService: AppService) {
  }

  formatDate(timestamp: string): string {
    const date = new Date(Number(timestamp) * 1000);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} (${date.toLocaleDateString()})`;
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
