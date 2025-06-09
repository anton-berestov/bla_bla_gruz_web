import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [FormsModule, NgIf, NgbModule],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss',
})
export class DimensionsComponent {
  protected length: string = '';
  protected width: string = '';
  protected height: string = '';

  protected appService = inject(AppService);
  protected activeModal = inject(NgbActiveModal);

  handlerLength(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.length = value;
  }

  handlerWidth(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.width = value;
  }

  handlerHeight(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.height = value;
  }

  apply() {
    this.activeModal.close(`${this.length}x${this.width}x${this.height}`);
  }

  clear() {
    this.length = '';
    this.width = '';
    this.height = '';
    this.appService.searchSize = '';
  }
}
