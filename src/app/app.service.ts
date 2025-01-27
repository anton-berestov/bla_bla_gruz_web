import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CargoType } from './models/CargoType';
import { Observable, Timestamp } from 'rxjs';
import { objToFormData } from './helpers/form';
import { Route } from './models/Route';
import { SearchData } from './models/SearchData';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  private baseUrl = environment.baseUrl;

  public cargoTypes: Observable<CargoType[]> = new Observable();
  public selectedCargoTypes: number[] = [];
  public routes: Route[] = [ {
    'route': '48',
    'weight': '2000',
    'price': '500',
    'account': {
      'name': '\u0410\u043d\u0442\u043e\u043d \u0411\u0435\u0440\u0435\u0441\u0442\u043e\u0432',
      'rating': 0
    },
    'start': {
      'point': '\u041c\u043e\u0441\u043a\u0432\u0430, \u0420\u043e\u0441\u0441\u0438\u044f',
      'date': '1738065600'
    },
    'end': {
      'point': '\u0418\u0436\u0435\u0432\u0441\u043a, \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0423\u0434\u043c\u0443\u0440\u0442\u0438\u044f, \u0420\u043e\u0441\u0441\u0438\u044f',
      'date': '1738230000'
    }
  },
    {
      'route': '48',
      'weight': '2000',
      'price': '500',
      'account': {
        'name': '\u0410\u043d\u0442\u043e\u043d \u0411\u0435\u0440\u0435\u0441\u0442\u043e\u0432',
        'rating': 0
      },
      'start': {
        'point': '\u041c\u043e\u0441\u043a\u0432\u0430, \u0420\u043e\u0441\u0441\u0438\u044f',
        'date': '1738065600'
      },
      'end': {
        'point': '\u0418\u0436\u0435\u0432\u0441\u043a, \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0423\u0434\u043c\u0443\u0440\u0442\u0438\u044f, \u0420\u043e\u0441\u0441\u0438\u044f',
        'date': '1738230000'
      }
    } ]

  public searchDate: any;
  public searchWhere: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchFrom: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchWeight: string = '';
  public searchSize: string = '';

  getCargoTypes() {
    this.cargoTypes = this.http.get<CargoType[]>(`${this.baseUrl}routes/get_cargo_types`);
  }

  searchRoutes() {
    const data: SearchData = {
      start: `${this.searchFrom.lat},${this.searchFrom.lng}`,
      end: `${this.searchWhere.lat},${this.searchWhere.lng}`,
      date: this.searchDate,
    };

    if (this.searchSize) data.size = this.searchSize
    if (this.searchWeight) data.weight = this.searchWeight
    if (this.selectedCargoTypes?.length) {
      data.cargo_types = [ ...this.selectedCargoTypes ];
    }

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
