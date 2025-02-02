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

  public isLoading: boolean = false

  public cargoTypes: Observable<CargoType[]> = new Observable();
  public selectedCargoTypes: number[] = [];
  public routes: Route[] = [
    {
      "start": {
        "route": "49",
        "point": "Москва, Россия",
        "weight": "0",
        "date": "1738612800",
        "price": "0",
        "size": "",
        "comment": "Срочно",
        "account": "48"
      },
      "checkpoints": [
        {
          "point": "Казань, Респ. Татарстан, Россия",
          "date": "1738688400"
        },
        {
          "point": "Ижевск, республика Удмуртия, Россия",
          "date": "1738785600"
        }
      ],
      "end": {
        "point": "Киров, Кировская обл., Россия",
        "date": "1738864800"
      },
      "cargoes": [],
      "account": {
        "account": "48",
        "name": "Антон Берестов",
        "rating": "0",
        "photo": "http://blablagruz.com/content/rest/img/avatars/48/1718297992329_user_48.jpeg"
      }
    },
    {
      "start": {
        "route": "49",
        "point": "Москва, Россия",
        "weight": "0",
        "date": "1738612800",
        "price": "0",
        "size": "",
        "comment": "Срочно",
        "account": "48"
      },
      "checkpoints": [
        {
          "point": "Казань, Респ. Татарстан, Россия",
          "date": "1738688400"
        },
        {
          "point": "Ижевск, республика Удмуртия, Россия",
          "date": "1738785600"
        }
      ],
      "end": {
        "point": "Киров, Кировская обл., Россия",
        "date": "1738864800"
      },
      "cargoes": [],
      "account": {
        "account": "48",
        "name": "Антон Берестов",
        "rating": "0",
        "photo": "http://blablagruz.com/content/rest/img/avatars/48/1718297992329_user_48.jpeg"
      }
    }
  ]

  public searchDate: any;
  public searchWhere: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchFrom: { lat: number | undefined; lng: number | undefined } = { lat: 0, lng: 0 };
  public searchWeight: string = '';
  public searchSize: string = '';

  public searchFromString = ''
  public searchToString = ''

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
      (response: any) => {
        response.forEach((route: any) => {
          this.http.post<Route>(`${this.baseUrl}routes/get_detailed_information`, objToFormData({ route: route.route }))
            .subscribe((data: Route) => {
              this.routes.push(data);
              this.isLoading = false;
            });
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
