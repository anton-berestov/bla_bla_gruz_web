import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { objToFormData } from '../../helpers/form';

@Injectable({
  providedIn: 'root'
})
export class CreateRouteService {
  private http = inject(HttpClient)

  constructor() { }

  private baseUrl = environment.baseUrl;

  createRoute(value: any) {
    return this.http.post(`${this.baseUrl}routes/create`, value)
  }
}
