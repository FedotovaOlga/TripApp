import { Component, inject, signal, Signal } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { PageResponse, Trip } from '../../models/trip-model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ParticipationService } from '../../services/participation-service';
// import { MatIconModule } from "@angular/material/icon";
// import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-my-trips',
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule, RouterLink, MatPaginatorModule, MatTabsModule],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.scss',
})
export class MyTrips {
  readonly tripService = inject(TripService);
  readonly participationService = inject(ParticipationService);

  pageSize = signal(5);
  pageIndex = signal(0);
  joinedPageSize = signal(5);
  joinedPageIndex = signal(0);
  publishedPageSize = signal(5);
  publishedPageIndex = signal(0);

  drafts = httpResource<PageResponse<Trip>>(() => `${environment.backendUrl}/trips/me?status=DRAFT&page=${this.pageIndex()}&size=${this.pageSize()}`);
  publishedTrips = httpResource<PageResponse<Trip>>(() => `${environment.backendUrl}/trips/me?status=PUBLISHED&page=${this.publishedPageIndex()}&size=${this.publishedPageSize()}`);
  joinedTrips = httpResource<PageResponse<Trip>>(() => `${environment.backendUrl}/participations/joined?page=${this.joinedPageIndex()}&size=${this.joinedPageSize()}`);

  onDelete (tripId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) return;
    this.tripService.delete(tripId).subscribe({
      next: () => {
        const currentTrips = this.drafts.value();
        if(currentTrips) {
          this.drafts.set({
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

  onPublish (tripId: string) {
    if (!confirm('Êtes-vous sûr de vouloir publier ce voyage ?')) return;
    this.tripService.publish(tripId).subscribe({
      next: () => {
        const currentTrips = this.drafts.value();
        if(currentTrips) {
          this.drafts.set({
            ...currentTrips,
            content: currentTrips.content.filter(trip => trip.id !== tripId),
            totalElements: currentTrips.totalElements - 1
          });
        }
        this.publishedTrips.reload();
      }
    })
  }

  onCancel (tripId: string) {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce voyage ?')) return;
    this.tripService.cancel(tripId).subscribe({
      next: () => {
        const currentTrips = this.publishedTrips.value();
        if(currentTrips) {
          this.publishedTrips.set({
            ...currentTrips,
            content: currentTrips.content.filter(trip => trip.id !== tripId),
            totalElements: currentTrips.totalElements - 1
          });
        }
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }

  handleJoinedPageEvent(e: PageEvent) {
    this.joinedPageSize.set(e.pageSize);
    this.joinedPageIndex.set(e.pageIndex);
  }

  handlePublishedPageEvent(e: PageEvent) {
    this.publishedPageSize.set(e.pageSize);
    this.publishedPageIndex.set(e.pageIndex);
  }

  getFile(trip: Trip): string {
    return (trip.imageUrl ? `${environment.backendUrl}/files/${trip.imageUrl}` : 'default-trip.jpg');
  }

  leaveTrip(tripId: string) {
    this.participationService.leaveTrip(tripId).subscribe({
      next: () => this.joinedTrips.reload(),
      error: (err) => console.error('Erreur de désinscription du voyage', err)
    });
  }

  isJoined(tripId: string) {
    return this.joinedTrips.value()?.content?.some( t => t.id === tripId) ?? false;
  }

}
