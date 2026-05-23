import { Component, inject, signal } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { form, minLength, required, submit, validate, FormField, min } from '@angular/forms/signals';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTimepickerModule} from '@angular/material/timepicker';

@Component({
  selector: 'app-trip-add',
  imports: [MatFormFieldModule, MatInputModule, FormField, MatCheckboxModule, MatAnchor, MatDatepickerModule, MatTimepickerModule, RouterLink],
  templateUrl: './trip-add.html',
  styleUrl: './trip-add.scss',
})
export class TripAdd {

  private readonly tripService = inject(TripService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  trip = signal({
  title: '',
  description: '',
  startAt: '',
  endAt: '',
  locationLabel: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  capacity: 0,
  isPaid: false,
  price: 0,
  });
  file = signal(undefined as File | undefined);
  status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  tripForm = form(this.trip, schema => {
    required(schema.title, { message: 'Le titre est obligatoire' });
    minLength(schema.title, 5, { message: 'Le titre doit faire au moins 5 caractères' });
    required(schema.startAt, { message: 'La date de début est obligatoire' });
    required(schema.endAt, { message: 'La date de fin est obligatoire' });
    required(schema.locationLabel, { message: 'Le lieu est obligatoire' });
    required(schema.address, { message: 'L\'adresse est obligatoire' });
    required(schema.capacity, { message: 'La capacité est obligatoire' });
    min(schema.capacity, 2, { message: 'La capacité doit être d\'au moins 2 personnes' });
    validate(schema.price, ({value, valueOf}) => {
      const isPaid = valueOf(schema.isPaid);
      const price = value();
      if (isPaid && price < 0.01) {
        return {
          kind: 'priceTooLow',
          message: 'Le prix doit être d\'au moins 0.01 €'
        };
      }
      return null;
    });
    validate(schema.startAt, ({value}) => {
      const start = value();
      if (start && new Date(start) < new Date()) {
        return {
          kind: 'startInPast',
          message: 'La date de début doit être dans le futur',
        };
      }
      return null;
    });
    validate(schema.endAt, ({value, valueOf}) => {
      const end = value();
      const start = valueOf(schema.startAt);
      if (start && end && (new Date(end) < new Date(start))) {
        return {
          kind: 'endBeforeStart',
          message: 'La date de fin doit être après la date de début',
        };
      }
      return null;
    });
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file.set(input.files[0]);
    }
  }

  onSubmit() {
    submit(this.tripForm, async () => {
      const tripData = {
        ...this.trip(),
      };
      this.status.set('submitting');
      this.snackBar.open('Création en cours...', 'Fermer');
      this.tripService.save(tripData, this.file()).subscribe({
        next: (savedTrip) => {
          this.status.set('success');
          this.snackBar.open('Voyage créé avec succès !', 'Fermer', { duration: 2000 });
          setTimeout(() => {
            this.router.navigate(['/trips']);
          }, 2000);
        },
        error: (error) => {
          this.status.set('error');
          this.snackBar.open('Erreur lors de la création du voyage', 'Fermer', { duration: 2000 });
        }
      })
    });
  }
}
