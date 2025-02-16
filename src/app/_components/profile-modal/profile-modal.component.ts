import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { NgbActiveModal, NgbDate, NgbInputDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-modal',
  imports: [
    FormsModule,
    MatInput,
    NgxMaskDirective,
    ReactiveFormsModule,
    NgbInputDatepicker
  ],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss'
})
export class ProfileModalComponent implements OnInit {
  public activeModal = inject(NgbActiveModal);
  private modalService = inject(NgbModal);
  private profileService = inject(ProfileService)
  private fb = inject(FormBuilder)

  //@ts-ignore
  public userForm: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [ '', Validators.required ],
      surname: [ '', Validators.required ],
      phone: [ '', [ Validators.required, Validators.pattern(/^\d+$/) ] ],
      photo: [ '' ],
      email: [ '', [ Validators.required, Validators.email ] ],
      rating: 0,
      birthday: [ '', Validators.required ],
    });

    this.profileService.getProfile().subscribe((data: any) => {
      this.userForm.patchValue({
        name: data.name || '',
        surname: data.surname || '',
        phone: data.phone || '',
        photo: data.photo || '',
        email: data.email || '',
        rating: data.rating || 0
      });
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.userForm.patchValue({ photo: result });
      };

      reader.readAsDataURL(file);
    }
  }

  updateProfile(form: FormGroup) {
    const data = {
      name: form.value.name,
      surname: form.value.surname,
      phone: `7${form.value.phone}`,
      email: form.value.email,
      birthday: form.value.birthday,
      account: localStorage.getItem('accountId'),
    }

    this.profileService.updateProfile(data).subscribe((data) => {
      console.log(data)
    })
  }

  onDateSelect(date: NgbDate): void {
    const newDate = new Date(date.year, date.month - 1, date.day);
    this.userForm.get('birthday')?.setValue(Math.floor(newDate.getTime() / 1000));
  }
}
