import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;

    const parts = value.split('.');
    if (parts.length === 3) {
      return { day: +parts[0], month: +parts[1], year: +parts[2] };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';

    const day = date.day < 10 ? `0${date.day}` : date.day;
    const month = date.month < 10 ? `0${date.month}` : date.month;
    return `${day}.${month}.${date.year}`;
  }
}
