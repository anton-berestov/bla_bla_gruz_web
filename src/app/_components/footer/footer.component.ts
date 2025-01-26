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

}
