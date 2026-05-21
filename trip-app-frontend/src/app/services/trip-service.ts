import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
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

  save(trip: Omit<Trip, 'id' | 'creatorId' | 'creatorName' | 'status'>): Observable<Trip> {
    return this.httpClient.post<Trip>(this.backendUrl, trip);
  }

  findMine(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(`${this.backendUrl}/me`);
  }

  update(trip: Trip): Observable<Trip> {
    return this.httpClient.put<Trip>(`${this.backendUrl}/${trip.id}`, trip);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.backendUrl}/${id}`);
  }

  findByIdWithResource(id: Signal<string>): HttpResourceRef<Trip > {
    return httpResource<Trip>(() => `${this.backendUrl}/${id()}`) as HttpResourceRef<Trip>;
  }
}
