import { DatePipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import 'moment/locale/ru';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-routes',
  imports: [NgForOf, DatePipe, NgIf, NgClass, NgStyle, NgbTooltip],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
})
export class RoutesComponent implements OnInit {
  @Output() openDialogue = new EventEmitter<string>();
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);

  constructor(protected appService: AppService) {
    moment.locale('ru');
  }

  protected activeIndex: number | null = null;
  protected isAuth: boolean = false;

  ngOnInit(): void {
    this.authService.isAuth$.subscribe((auth) => {
      this.isAuth = auth;
    });
  }

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

  openChat(route: any) {
    this.openDialogue.emit(route.account.account);
  }

  openLoginModal() {
    this.modalService.open(LoginModalComponent);
  }
}
