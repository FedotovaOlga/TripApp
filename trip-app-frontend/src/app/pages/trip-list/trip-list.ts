import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { Trip } from '../../models/trip-model';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TripService } from '../../services/trip-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { httpResource } from '@angular/common/http';

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, DatePipe, MatCardModule, NgbDatepickerModule, MatButtonModule, RouterLink, MatPaginatorModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList {
  readonly tripService = inject(TripService);
  // readonly trips: Signal<Trip[] | undefined> = toSignal(this.tripService.findAll());

  pageSize = signal(2);
  pageIndex = signal(0);

  trips = httpResource<PageResponse<Trip>>(() =>
    `${environment.backendUrl}/trips/me?page=${this.pageIndex()}&size=${this.pageSize()}`
);

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }

  getFile(trip: Trip): string {
    return (trip.imageUrl ? `${environment.backendUrl}/files/${trip.imageUrl}` : 'default-trip.jpg');
  }

  joinTrip(tripId: string) {
    this.tripService.
  }
}
