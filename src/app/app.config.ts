import {
  ApplicationConfig,
  importProvidersFrom,
  Injectable,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import ruLocale from '@angular/common/locales/ru';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { provideNgxMask } from 'ngx-mask';
import { routes } from './app.routes';

registerLocaleData(ruLocale, 'ru');
@Injectable({ providedIn: 'root' })
class CustomDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string) {
    if (!value) return null;
    const parts = value.split('.');
    return { year: +parts[2], month: +parts[1], day: +parts[0] };
  }

  format(date: any) {
    return date ? `${date.day}.${date.month}.${date.year}` : '';
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(NgbDatepickerModule),
    importProvidersFrom(NgbDatepickerModule),
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    provideNgxMask(),
  ],
};
