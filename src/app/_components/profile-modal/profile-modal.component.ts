import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { JsonPipe, NgIf } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { NgbActiveModal, NgbDate, NgbDateStruct, NgbInputDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './profile.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-modal',
  imports: [
    FormsModule,
    MatInput,
    NgxMaskDirective,
    ReactiveFormsModule,
    NgbInputDatepicker,
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
      const birthday = data.birthday ? new Date(Number(data.birthday)*1000) : null;

      const birthdayStruct: NgbDateStruct | null = birthday
        ? {
          year: birthday.getFullYear(),
          month: birthday.getMonth() + 1,
          day: birthday.getDate(),
        }
        : null;

      this.userForm.patchValue({
        name: data.name || '',
        surname: data.surname || '',
        phone: data.phone ? data.phone.slice(1) : '',
        photo: data.photo || '',
        email: data.email || '',
        rating: data.rating || 0,
        birthday: birthdayStruct,
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
      birthday: this.onDate(form.value.birthday),
      account: localStorage.getItem('accountId'),
      photo: form.value.photo
    }

    this.profileService.updateProfile(data).subscribe((data) => {
      console.log(data)
    })
  }

  onDate(date: NgbDate): number {
    const newDate = new Date(date.year, date.month - 1, date.day);
    return Math.floor(newDate.getTime() / 1000)
  }
}
