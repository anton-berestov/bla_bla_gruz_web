import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-modal',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    MatInput,
    NgxMaskDirective,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  public activeModal = inject(NgbActiveModal);
  private modalService = inject(NgbModal);
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private appService = inject(AppService)


  public isSms: boolean = false

  @Input() name: string | undefined;

  public userForm: FormGroup = new FormGroup([]);

  constructor() {
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
        ],
      ],
      'device': 3,
      'firebase': '',
      'key': ''
    });
  }

  sendSms(form: FormGroup) {
    const data = form.value;
    data.phone = `7${data.phone}`;

    this.appService.login(data).subscribe((response) => {
      if (response.result) {
        this.isSms = true
      }
    }, (error) => {
      console.error('Ошибка при отправке SMS:', error);
    });
  }

  checkSms(form: FormGroup) {
    const data = {
      account: localStorage.getItem('accountId'),
      key: form.value.key
    }
    this.appService.checkService(data).subscribe((data: any) => {
      if (data.result == 1) {
        this.modalService.dismissAll(LoginModalComponent);
        this.authService.updateAuthStatus()
      }
    })
  }
}
