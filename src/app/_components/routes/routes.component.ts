import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-routes',
  imports: [
    NgForOf
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
}
