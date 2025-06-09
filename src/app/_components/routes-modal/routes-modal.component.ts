import { Component, inject, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Route } from '../../models/Route';

@Component({
  selector: 'app-routes-modal',
  imports: [],
  templateUrl: './routes-modal.component.html',
  styleUrl: './routes-modal.component.scss'
})
export class RoutesModalComponent implements OnInit {

  public appService = inject(AppService)
  public routes: Route[] = []

  ngOnInit() {
    this.appService.getRoutes().subscribe((data) => this.routes = data.routes)
  }

}
