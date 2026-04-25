import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { Trip } from '../models/trip-model';


@Injectable({
  providedIn: 'root',
})
export class TripService {

  private readonly httpClient = inject(HttpClient);
  private readonly backendUrl = `${environment.backendUrl}/trips`;

  findAll(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(this.backendUrl);
  }
}
