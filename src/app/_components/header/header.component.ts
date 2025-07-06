import { isPlatformBrowser, NgIf } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { CreateRouteModalComponent } from '../create-route-modal/create-route-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { RoutesModalComponent } from '../routes-modal/routes-modal.component';

@Component({
  selector: 'app-header',
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  private authService = inject(AuthService);

  public isAuth: boolean = false;
  private intervalId: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  open() {
    this.modalService.open(LoginModalComponent);
  }

  ngOnInit(): void {
    this.authService.isAuth$.subscribe((auth) => {
      this.isAuth = auth;
    });
  }

  logout() {
    localStorage.removeItem('accountId');
    this.authService.updateAuthStatus();
  }

  getProfile() {
    this.modalService.open(ProfileModalComponent);
  }

  createRoute() {
    this.modalService.open(CreateRouteModalComponent);
  }

  openRoutes() {
    this.modalService.open(RoutesModalComponent);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
