import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { objToFormData } from '../../helpers/form';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  private http = inject(HttpClient)
  private baseUrl = environment.baseUrl;
  constructor() { }

  login(value: any): Observable<any> {
    return this.http.post(`${this.baseUrl}user/auth`, objToFormData(value)).pipe(
      switchMap((data: any) => {
        if (data != null && data.error == 0) {
          localStorage.setItem('accountId', data.account)
          return this.http.post(`${this.baseUrl}user/get_auth_key`, objToFormData({
            account: data.account,
            country: 'RU'
          }));
        }
        return of(data);
      })
    );
  }

  checkService(value: any) {
    return this.http.post(`${this.baseUrl}user/check_auth_code`, objToFormData(value))
  }
}
