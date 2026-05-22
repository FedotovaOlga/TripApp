import { Component, inject, signal, Signal } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { Trip } from '../../models/trip-model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-my-trips',
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule, RouterLink, MatPaginatorModule],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.scss',
})
export class MyTrips {
  readonly tripService = inject(TripService);
  // readonly trips: Signal <Trip[] | undefined> = toSignal(this.tripService.findMine());

  pageSize = signal(2);
  pageIndex = signal(0);

  trips = httpResource<PageResponse<Trip>>(() => `${environment.backendUrl}/trips/me?page=${this.pageIndex()}&size=${this.pageSize()}`);

  onDelete (tripId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) return;
    this.tripService.delete(tripId).subscribe({
      next: () => {
        const currentTrips = this.trips.value();
        if(currentTrips) {
          this.trips.set({
            ...currentTrips,
            content: currentTrips.content.filter(trip => trip.id !== tripId),
            totalElements: currentTrips.totalElements - 1
          });
        }
      },
      error: (err) => {
        alert('Une erreur est survenue lors de la suppression du voyage : ' + err.message);
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }

}
