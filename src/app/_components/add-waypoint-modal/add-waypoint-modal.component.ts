import { isPlatformBrowser, NgForOf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
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
  NgbDateStruct,
  NgbInputDatepicker,
  NgbTimepicker,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-waypoint-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgbInputDatepicker,
    NgbTimepicker,
  ],
  templateUrl: './add-waypoint-modal.component.html',
  styleUrl: './add-waypoint-modal.component.scss',
})
export class AddWaypointModalComponent implements AfterViewInit {
  protected activeModal = inject(NgbActiveModal);
  private googleApiKey = environment.googleApiKey;

  @ViewChild('pointNameInput') pointNameInput!: ElementRef;
  @ViewChild('d') public d!: NgbInputDatepicker;
  suggestions: google.maps.places.AutocompletePrediction[] = [];
  autocomplete!: google.maps.places.AutocompleteService;

  public minDate: NgbDateStruct;
  private today = new Date();

  protected waypointForm = new FormGroup({
    point: new FormControl('', Validators.required),
    coordinates: new FormControl<{
      lat: number | undefined;
      lng: number | undefined;
    }>(
      {
        lat: 0,
        lng: 0,
      },
      Validators.required
    ),
    date: new FormControl(new Date(), Validators.required),
    time: new FormControl<NgbTimeStruct | null>(null, Validators.required),
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

  protected initializeAutocomplete(): void {
    if (typeof window !== 'undefined' && window.google) {
      this.autocomplete = new google.maps.places.AutocompleteService();

      this.pointNameInput.nativeElement.addEventListener('input', () => {
        const query = this.pointNameInput.nativeElement.value;
        if (query) {
          this.autocomplete.getPlacePredictions(
            { input: query },
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                this.suggestions = predictions;
              } else {
                this.suggestions = [];
              }
            }
          );
        } else {
          this.suggestions = [];
        }
      });
    }
  }

  selectSuggestion(
    suggestion: google.maps.places.AutocompletePrediction
  ): void {
    this.pointNameInput.nativeElement.value = suggestion.description;

    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          this.waypointForm.get('point')?.setValue(suggestion.description);
          this.waypointForm.get('coordinates')?.setValue({
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
          });
        } else {
          console.error('Error status:', status);
        }
      }
    );
    this.suggestions = [];
  }

  onDateSelect(date: NgbDateStruct, datepicker: any): void {
    setTimeout(() => {
      datepicker.close();
    }, 0);
    const newDate = new Date(date.year, date.month - 1, date.day);
    this.waypointForm.get('date')?.setValue(newDate);
  }

  saveWaypoint(): void {
    if (this.waypointForm.valid) {
      const timeValue = this.waypointForm.get('time')?.value;
      const waypointData = {
        point: this.waypointForm.get('point')?.value,
        coordinates: this.waypointForm.get('coordinates')?.value,
        date: this.getTimestampFromDateAndTime(
          this.waypointForm.get('date')?.value,
          timeValue
        ),
        time: timeValue
          ? `${timeValue.hour.toString().padStart(2, '0')}:${timeValue.minute
              .toString()
              .padStart(2, '0')}`
          : null,
      };
      this.activeModal.close(waypointData);
    }
  }

  getTimestampFromDateAndTime(startDate: any, startTime: any) {
    let year, month, day;

    if (startDate instanceof Date) {
      year = startDate.getFullYear();
      month = startDate.getMonth();
      day = startDate.getDate();
    } else if (startDate && typeof startDate === 'object') {
      year = startDate.year;
      month = startDate.month - 1; // Convert to 0-based month
      day = startDate.day;
    } else {
      throw new Error('Invalid date format');
    }

    const hours = startTime.hour;
    const minutes = startTime.minute;
    const seconds = startTime.second;

    const combinedDate = new Date(year, month, day, hours, minutes, seconds);
    return Math.floor(combinedDate.getTime() / 1000);
  }
}
