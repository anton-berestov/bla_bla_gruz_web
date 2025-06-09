import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dimensions',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss'
})
export class DimensionsComponent {

  protected length: string = ''
  protected width: string = ''
  protected height: string = ''

  constructor(
    protected appService: AppService,
    public dialogRef: MatDialogRef<DimensionsComponent>) {
  }


  handlerLength(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.length = value;
  }

  handlerWidth(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.width = value;
  }

  handlerHeight(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.height = value;
  }

  apply() {
    this.dialogRef.close(`${this.length}x${this.width}x${this.height}`)
  }

  clear() {
    this.length = ''
    this.width = ''
    this.height = ''
    this.appService.searchSize = ''
  }
}
