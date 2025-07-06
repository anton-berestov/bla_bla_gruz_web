import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ToastService } from './_components/toast/toast.service';
import { objToFormData } from './helpers/form';
import { CargoType } from './models/CargoType';
import { Route } from './models/Route';
import { SearchData } from './models/SearchData';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  constructor() {}

  private baseUrl = environment.baseUrl;
  public isLoading: boolean = false;

  public cargoTypes: Observable<CargoType[]> = new Observable();
  public selectedCargoTypes: number[] = [];
  public routes: Route[] = [];

  public searchDate: any;
  public searchWhere: { lat: number | undefined; lng: number | undefined } = {
    lat: 0,
    lng: 0,
  };
  public searchFrom: { lat: number | undefined; lng: number | undefined } = {
    lat: 0,
    lng: 0,
  };
  public searchWeight: string = '';
  public searchSize: string = '';

  public searchFromString = '';
  public searchToString = '';

  getCargoTypes() {
    this.cargoTypes = this.http.get<CargoType[]>(
      `${this.baseUrl}routes/get_cargo_types`
    );
  }

  searchRoutes() {
    const data: SearchData = {
      start: `${this.searchFrom.lat},${this.searchFrom.lng}`,
      end: `${this.searchWhere.lat},${this.searchWhere.lng}`,
      date: this.searchDate,
    };

    if (this.searchSize) data.size = this.searchSize;
    if (this.searchWeight) data.weight = this.searchWeight;
    if (this.selectedCargoTypes?.length) {
      data.cargo_types = JSON.stringify(this.selectedCargoTypes.map(Number));
    }

    this.http
      .post<Route[]>(`${this.baseUrl}routes/search`, objToFormData(data))
      .subscribe(
        (response: any) => {
          this.routes = [];
          if (!response.length) {
            this.isLoading = false;
            this.toastService.show({
              message:
                'Маршруты на эту дату или с такими параметрами не найдены!',
              classname: 'bg-warning text-light',
              delay: 15000,
            });
          } else {
            this.toastService.clear();
            let completedRequests = 0;
            const totalRequests = response.length;

            response.forEach((route: any) => {
              this.http
                .post<Route>(
                  `${this.baseUrl}routes/get_detailed_information`,
                  objToFormData({ route: route.route })
                )
                .subscribe((data: Route) => {
                  console.log(data);
                  if (
                    data.account.account !== localStorage.getItem('accountId')
                  ) {
                    this.routes.push(data);
                  }

                  completedRequests++;
                  if (completedRequests === totalRequests) {
                    this.isLoading = false;
                    if (this.routes.length === 0) {
                      this.toastService.show({
                        message:
                          'Маршруты на эту дату или с такими параметрами не найдены!',
                        classname: 'bg-warning text-light',
                        delay: 15000,
                      });
                    }
                  }
                });
            });
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  getRoutes() {
    return this.http.post<{ routes: Route[] }>(
      `${this.baseUrl}routes/get_my_routes_list`,
      objToFormData({ account: localStorage.getItem('accountId') })
    );
  }

  getMyRoutesList(account: string) {
    return this.http.post<any>(
      `${this.baseUrl}routes/get_my_routes_list`,
      objToFormData({ account, type: 1 })
    );
  }
}
