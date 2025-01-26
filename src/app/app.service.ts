import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CargoType } from './models/CargoType';
import { Observable, Timestamp } from 'rxjs';
import { objToFormData } from './helpers/form';
import { Route } from './models/Route';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  private baseUrl = environment.baseUrl;

  public cargoTypes: Observable<CargoType[]> = new Observable();
  public selectedCargoTypes: number[] = [];
  public routes: Route[] = []

  public searchDate: any;
  public searchWhere: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchFrom: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchWeight: string = '';
  public searchSize: string = '';

  getCargoTypes() {
    this.cargoTypes = this.http.get<CargoType[]>(`${this.baseUrl}routes/get_cargo_types`);
  }

  searchRoutes() {
    const data = {
      start: `${this.searchFrom.lat},${this.searchFrom.lng}`,
      end: `${this.searchWhere.lat},${this.searchWhere.lng}`,
      date: this.searchDate,
      // size: this.searchSize ? this.searchSize : null,
      // weight: this.searchWeight ? this.searchWeight : null
    };

    // if (this.selectedCargoTypes.length) {
    //   data.cargo_types = [];
    //   this.selectedCargoTypes.map((el) => {
    //     data.cargo_types.push(el.cargo_type);
    //   });
    // }

    this.http.post<Route[]>(`${this.baseUrl}routes/search`, objToFormData(data)).subscribe(
      (response: Route[]) => {
        this.routes = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
