import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Trip } from '../../models/trip-model';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TripService } from '../../services/trip-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, DatePipe, NgbDatepickerModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList {
// [x: string]: any;
  readonly tripService = inject(TripService);
  readonly trips: Signal<Trip[] | undefined> = toSignal(this.tripService.findAll());
}
