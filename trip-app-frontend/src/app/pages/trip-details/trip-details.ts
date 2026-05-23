import { Component, inject, input } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { DatePipe, Location } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Trip } from '../../models/trip-model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trip-details',
  imports: [DatePipe, MatCardModule, MatButtonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetails {
  private readonly tripService = inject(TripService);
  private location = inject(Location);
  
  id = input.required<string>();
  trip = this.tripService.findByIdWithResource(this.id);
  
  goBack() { this.location.back()};

  getFile(trip: Trip): string {
      return (trip.imageUrl ? `${environment.backendUrl}/files/${trip.imageUrl}` : 'default-trip.jpg');
  }

}
