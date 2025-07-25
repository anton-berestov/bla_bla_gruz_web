import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { StoreComponent } from '../store/store.component';

@Component({
  selector: 'app-footer',
  imports: [
    NgClass
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  openGooglePlay() {
    window.open('https://play.google.com/store/apps/details?id=com.blablagruz.app', '_blank');
  }

  openAppStore() {
    window.open('https://apps.apple.com/ru/app/blablagruz/id1604597886?l=en-GB', '_blank')
  }

  openMailClient() {
    window.location.href = 'mailto:info@blablagruz.com';
  }

}
