import { Component } from '@angular/core';

@Component({
  selector: 'app-store',
  imports: [],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {

  openGooglePlay() {
    window.open('https://play.google.com/store/apps/details?id=com.blablagruz.app', '_blank');
  }

  openAppStore() {
    window.open('https://apps.apple.com/ru/app/blablagruz/id1604597886?l=en-GB', '_blank')
  }

}
