import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dimensions',
  imports: [
    FormsModule
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss'
})
export class DimensionsComponent {

  protected length: string = ''
  protected width: string = ''
  protected height: string = ''

  constructor(protected appService: AppService, public dialogRef: MatDialogRef<DimensionsComponent>,) {
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
    this.appService.searchSize = `${this.length}x${this.width}x${this.height}`
    this.dialogRef.close(false)
  }
}
