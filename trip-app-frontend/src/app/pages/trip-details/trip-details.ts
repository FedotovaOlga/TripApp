import { Component, inject, input } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { DatePipe, Location } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Trip } from '../../models/trip-model';
import { environment } from '../../../environments/environment';
import { ParticipationService } from '../../services/participation-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-trip-details',
  imports: [DatePipe, MatCardModule, MatButtonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetails {
  private readonly tripService = inject(TripService);
  private location = inject(Location);
  private readonly participationService = inject(ParticipationService);
  private readonly authService = inject(AuthService);

  id = input.required<string>();
  trip = this.tripService.findByIdWithResource(this.id);
  joinedTrips = this.participationService.getJoinedWithRessource();
  currentUser = this.authService.user;

  goBack() { this.location.back()};

  getFile(trip: Trip): string {
      return (trip.imageUrl ? `${environment.backendUrl}/files/${trip.imageUrl}` : 'default-trip.jpg');
  }

  joinTrip(tripId: string) {
    this.participationService.joinTrip(tripId).subscribe({
      next: () => {
        this.joinedTrips.reload(),
        this.trip.reload();
      },
      error: (err) => console.error('Erreur inscription au voyage', err)
    });
  }

  leaveTrip(tripId: string) {
    this.participationService.leaveTrip(tripId).subscribe({
      next: () => {
        this.joinedTrips.reload(),
        this.trip.reload();
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
