import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [
    NgbToast,
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastComponent {
  toastService = inject(ToastService);

}
