import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { PageResponse, Trip } from '../../models/trip-model';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TripService } from '../../services/trip-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { httpResource } from '@angular/common/http';
import { ParticipationService } from '../../services/participation-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, DatePipe, MatCardModule, NgbDatepickerModule, MatButtonModule, RouterLink, MatPaginatorModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList {
  private readonly participationService = inject(ParticipationService);
  private readonly authService = inject(AuthService);

  pageSize = signal(5);
  pageIndex = signal(0);

  trips = httpResource<PageResponse<Trip>>(() =>
    `${environment.backendUrl}/trips?page=${this.pageIndex()}&size=${this.pageSize()}`
);
  joinedTrips = this.participationService.getJoinedWithRessource();
  currentUser = this.authService.user;

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }

  getFile(trip: Trip): string {
    return (trip.imageUrl ? `${environment.backendUrl}/files/${trip.imageUrl}` : 'default-trip.jpg');
  }

  joinTrip(tripId: string) {
    this.participationService.joinTrip(tripId).subscribe({
      next: () => {
        this.joinedTrips.reload(),
        this.trips.reload();
      },
      error: (err) => console.error('Erreur inscription au voyage', err)
    });
  }

  leaveTrip(tripId: string) {
    this.participationService.leaveTrip(tripId).subscribe({
      next: () => {
        this.joinedTrips.reload(),
        this.trips.reload();
      },
      error: (err) => console.error('Erreur de désinscription du voyage', err)
    });
  }

  isCreator(trip: Trip): boolean {
    return this.currentUser()?.id === trip.creatorId;
  }

  isJoined(tripId: string) {
    return this.joinedTrips.value()?.content?.some( t => t.id === tripId) ?? false;
  }

}
