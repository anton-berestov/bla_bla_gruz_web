import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { objToFormData } from '../../helpers/form';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient)
  private baseUrl = environment.baseUrl;

  constructor() {
  }

  getProfile() {
    const data = {
      account: localStorage.getItem('accountId')
    }
    return this.http.post(`${this.baseUrl}user/get_profile`, objToFormData(data))
  }

  updateProfile(value: any) {
    return this.http.post(`${this.baseUrl}user/update_settings`, objToFormData(value))
  }
}
