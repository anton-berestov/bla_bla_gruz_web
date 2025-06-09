import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbModal,
  NgbTimepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../_components/toast/toast.service';
import { AppService } from '../../app.service';
import { DimensionsComponent } from '../dimensions/dimensions.component';
import { CreateRouteService } from './create-route.service';

@Component({
  selector: 'app-create-route-modal',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgbInputDatepicker,
    NgbTimepicker,
  ],
  templateUrl: './create-route-modal.component.html',
  styleUrl: './create-route-modal.component.scss',
})
export class CreateRouteModalComponent implements AfterViewInit {
  protected activeModal = inject(NgbActiveModal);
  protected appService = inject(AppService);
  protected createRouteService = inject(CreateRouteService);
  private modalService = inject(NgbModal);
  private googleApiKey = environment.googleApiKey;
  private toastService = inject(ToastService);

  @ViewChild('where') where!: ElementRef;
  @ViewChild('from') from!: ElementRef;
  suggestionsWhere: google.maps.places.AutocompletePrediction[] = [];
  suggestionsFrom: google.maps.places.AutocompletePrediction[] = [];
  autocomplete!: google.maps.places.AutocompleteService;

  public minDate: NgbDateStruct;

  private today = new Date();

  protected routeForm = new FormGroup({
    from_name: new FormControl('', Validators.required),
    from: new FormControl<{ lat: number | undefined; lng: number | undefined }>(
      {
        lat: 0,
        lng: 0,
      },
      Validators.required
    ),
    start_date: new FormControl(new Date(), Validators.required),
    start_time: new FormControl(null, Validators.required),
    where_name: new FormControl('', Validators.required),
    where: new FormControl<{
      lat: number | undefined;
      lng: number | undefined;
    }>(
      {
        lat: 0,
        lng: 0,
      },
      Validators.required
    ),
    end_date: new FormControl(new Date(), Validators.required),
    end_time: new FormControl(null, Validators.required),
    cargo_types: new FormControl([]),
    size: new FormControl(''),
    weight: new FormControl(null),
    waypoints: new FormControl([]),
    price: new FormControl(null),
  });

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.minDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsApi().then(() => this.initializeAutocomplete());
    }
  }

  private loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  private initializeAutocomplete(): void {
    if (typeof window !== 'undefined' && window.google) {
      this.autocomplete = new google.maps.places.AutocompleteService();

      this.where.nativeElement.addEventListener('input', () => {
        const query = this.where.nativeElement.value;
        if (query) {
          this.autocomplete.getPlacePredictions(
            { input: query },
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                this.suggestionsWhere = predictions;
              } else {
                this.suggestionsWhere = [];
              }
            }
          );
        } else {
          this.suggestionsWhere = [];
        }
      });

      this.from.nativeElement.addEventListener('input', () => {
        const query = this.from.nativeElement.value;
        if (query) {
          this.autocomplete.getPlacePredictions(
            { input: query },
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                this.suggestionsFrom = predictions;
              } else {
                this.suggestionsFrom = [];
              }
            }
          );
        } else {
          this.suggestionsFrom = [];
        }
      });
    }
  }

  selectSuggestionFrom(
    suggestion: google.maps.places.AutocompletePrediction
  ): void {
    this.handlePlaceSelection(
      suggestion,
      this.from.nativeElement,
      (location) => {
        this.routeForm.get('from_name')?.setValue(suggestion.description);
        this.routeForm.get('from')?.setValue(location);
      },
      () => {
        this.suggestionsFrom = [];
      }
    );
  }

  selectSuggestionWhere(
    suggestion: google.maps.places.AutocompletePrediction
  ): void {
    this.handlePlaceSelection(
      suggestion,
      this.where.nativeElement,
      (location) => {
        this.routeForm.get('where_name')?.setValue(suggestion.description);
        this.routeForm.get('where')?.setValue(location);
      },
      () => {
        this.suggestionsWhere = [];
      }
    );
  }

  handlePlaceSelection(
    suggestion: google.maps.places.AutocompletePrediction,
    inputElement: HTMLInputElement,
    assignTo: (location: {
      lat: number | undefined;
      lng: number | undefined;
    }) => void,
    clearSuggestions: () => void
  ): void {
    inputElement.value = suggestion.description;

    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          assignTo({
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
          });
        } else {
          console.error('Error status:', status);
        }
      }
    );
    clearSuggestions();
  }

  openDimensions() {
    try {
      const modalRef = this.modalService.open(DimensionsComponent, {
        size: 'md',
        backdrop: 'static',
        windowClass: 'dimensions-modal',
        centered: true,
      });

      modalRef.result
        .then((result) => {
          this.routeForm.get('size')?.setValue(result);
        })
        .catch((error) => {
          console.error('Error opening dimensions modal:', error);
        });
    } catch (error) {
      console.error('Error in openDimensions:', error);
    }
  }

  createRoute() {
    console.log('createRoute', this.routeForm.value);

    const formData = new FormData();

    formData.append('start[point]', this.routeForm.get('from_name')?.value!);
    formData.append(
      'start[date]',
      this.getTimestampFromDateAndTime(
        this.routeForm.get('start_date')?.value,
        this.routeForm.get('start_time')?.value
      ).toString()
    );
    formData.append(
      'start[coordinates]',
      `${this.routeForm.get('from')?.value!.lat},${
        this.routeForm.get('from')?.value!.lng
      }`
    );
    formData.append(
      'start[weight]',
      (this.routeForm.get('weight')?.value ?? 0).toString()
    );
    formData.append(
      'start[price]',
      (this.routeForm.get('price')?.value ?? 0).toString()
    );
    formData.append('start[account]', localStorage.getItem('accountId')!);

    formData.append('end[point]', this.routeForm.get('where_name')?.value!);
    formData.append(
      'end[date]',
      this.getTimestampFromDateAndTime(
        this.routeForm.get('end_date')?.value,
        this.routeForm.get('end_time')?.value
      ).toString()
    );
    formData.append(
      'end[coordinates]',
      `${this.routeForm.get('where')?.value!.lat},${
        this.routeForm.get('where')?.value!.lng
      }`
    );

    formData.append(
      'cargo_types',
      JSON.stringify(this.routeForm.get('cargo_types')?.value)
    );

    const waypoints = this.routeForm.get('waypoints')?.value;
    if (waypoints && waypoints.length > 0) {
      formData.append('checkpoints', JSON.stringify(waypoints));
    }

    formData.append('start[size]', this.routeForm.get('size')?.value || '');

    if (this.routeForm.get('comment')?.value) {
      formData.append('start[comment]', this.routeForm.get('comment')?.value!);
    }

    this.createRouteService.createRoute(formData).subscribe((data) => {
      console.log(data);
      this.toastService.show({
        message: 'Маршрут успешно создан!',
        classname: 'bg-success text-light',
        delay: 5000,
      });
      this.activeModal.close();
    });
  }

  onDateSelect(date: NgbDate, d: any, type: string): void {
    setTimeout(() => {
      d.close();
    }, 0);
    const newDate = new Date(date.year, date.month - 1, date.day);
    if (type == 'start_date') {
      this.routeForm.get('start_date')?.setValue(newDate);
    }

    if (type == 'end_date') {
      this.routeForm.get('end_date')?.setValue(newDate);
    }
  }

  getTimestampFromDateAndTime(startDate: any, startTime: any) {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();

    const hours = startTime.hour;
    const minutes = startTime.minute;
    const seconds = startTime.second;

    const combinedDate = new Date(year, month, day, hours, minutes, seconds);

    const timestampMilliseconds = combinedDate.getTime();

    return Math.floor(timestampMilliseconds / 1000);
  }
}
