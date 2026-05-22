import { Component, inject, input } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { DatePipe } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trip-details',
  imports: [DatePipe, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetails {
  private readonly tripService = inject(TripService);

  id = input.required<string>();
  trip = this.tripService.findByIdWithResource(this.id);

}
