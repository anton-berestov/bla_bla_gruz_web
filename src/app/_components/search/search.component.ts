import { AsyncPipe, isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import {
  NgbDate,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { DimensionsComponent } from '../dimensions/dimensions.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [
    NgbInputDatepicker,
    NgbDatepickerModule,
    NgIf,
    NgForOf,
    GoogleMapsModule,
    AsyncPipe,
    FormsModule,
  ],
  standalone: true,
  styleUrl: './search.component.scss',
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('where') where!: ElementRef;
  @ViewChild('from') from!: ElementRef;
  suggestionsWhere: google.maps.places.AutocompletePrediction[] = [];
  suggestionsFrom: google.maps.places.AutocompletePrediction[] = [];
  autocomplete!: google.maps.places.AutocompleteService;

  readonly dialog = inject(MatDialog);
  protected appService = inject(AppService);
  public minDate: NgbDateStruct;

  private googleApiKey = environment.googleApiKey;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private modalService: NgbModal
  ) {
    const today = new Date();
    this.minDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}&libraries=places&language=ru`;
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
            { input: query, language: 'ru' },
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
            { input: query, language: 'ru' },
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
      { placeId: suggestion.place_id, language: 'ru' },
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

  selectSuggestionWhere(
    suggestion: google.maps.places.AutocompletePrediction
  ): void {
    this.handlePlaceSelection(
      suggestion,
      this.where.nativeElement,
      (location) => {
        this.appService.searchWhere = location;
        this.appService.searchToString = suggestion.description;
      },
      () => {
        this.suggestionsWhere = [];
      }
    );
  }

  selectSuggestionFrom(
    suggestion: google.maps.places.AutocompletePrediction
  ): void {
    this.handlePlaceSelection(
      suggestion,
      this.from.nativeElement,
      (location) => {
        this.appService.searchFrom = location;
        this.appService.searchFromString = suggestion.description;
      },
      () => {
        this.suggestionsFrom = [];
      }
    );
  }

  onCheckboxChange(event: Event, cargoType: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.appService.selectedCargoTypes.push(cargoType);
    } else {
      this.appService.selectedCargoTypes =
        this.appService.selectedCargoTypes.filter((type) => type !== cargoType);
    }
  }

  onDateSelect(date: NgbDate, d: any): void {
    setTimeout(() => {
      d.close();
    }, 0);
    const newDate = new Date(date.year, date.month - 1, date.day);
    this.appService.searchDate = Math.floor(newDate.getTime() / 1000);
  }

  search() {
    this.appService.isLoading = true;
    this.appService.searchRoutes();
  }

  openDimensions() {
    const modalRef = this.modalService.open(DimensionsComponent, {
      size: 'md',
      backdrop: 'static',
      windowClass: 'dimensions-modal',
      centered: true,
    });

    modalRef.result
      .then((result) => {
        this.appService.searchSize = result;
      })
      .catch(() => {
        // Modal was dismissed
      });
  }
}
